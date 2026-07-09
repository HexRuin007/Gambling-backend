import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import crypto from "crypto";

const PORT = process.env.PORT || 8080;
const ADMIN_PIN = process.env.ADMIN_PIN || "42069";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const adminTokens = new Set();

const state = {
    bets: [],
    history: [],
    spinning: false
};

const wheel = [
    { multiplier: 0, weight: 14 },
    { multiplier: 0.1, weight: 16 },
    { multiplier: 0.25, weight: 14 },
    { multiplier: 0.5, weight: 13 },
    { multiplier: 0.75, weight: 10 },
    { multiplier: 1, weight: 9 },
    { multiplier: 1.25, weight: 8 },
    { multiplier: 1.5, weight: 6 },
    { multiplier: 2, weight: 5 },
    { multiplier: 3, weight: 3 },
    { multiplier: 5, weight: 1 },
    { multiplier: 10, weight: 1 }
];

function publicState() {
    return {
        bets: state.bets,
        history: state.history,
        spinning: state.spinning
    };
}

function emitState() {
    io.emit("state", publicState());
}

function pickMultiplier() {
    const total = wheel.reduce((sum, item) => sum + item.weight, 0);
    let roll = crypto.randomInt(1, total + 1);

    for (const item of wheel) {
        roll -= item.weight;
        if (roll <= 0) return item.multiplier;
    }

    return 1;
}

function isAdmin(token) {
    return token && adminTokens.has(token);
}

app.get("/", (req, res) => {
    res.json({ ok: true, app: "TT Shared Wheel", bets: state.bets.length, spinning: state.spinning });
});

app.get("/state", (req, res) => {
    res.json(publicState());
});

io.on("connection", (socket) => {
    socket.emit("state", publicState());

    socket.on("placeBet", (payload) => {
        if (state.spinning) return socket.emit("errorMessage", "Spin already running");

        const playerId = String(payload?.playerId || payload?.playerName || socket.id).slice(0, 80);
        const playerName = String(payload?.playerName || "Player").trim().slice(0, 60);
        const amount = Math.floor(Number(payload?.amount || 0));

        if (!playerName || amount < 1) return socket.emit("errorMessage", "Invalid bet");

        const existing = state.bets.find(b => b.playerId === playerId);
        if (existing) {
            existing.playerName = playerName;
            existing.amount = amount;
            existing.confirmed = false;
            existing.updatedAt = Date.now();
        } else {
            state.bets.push({ playerId, playerName, amount, confirmed: false, createdAt: Date.now() });
        }

        emitState();
    });

    socket.on("adminLogin", (payload, cb) => {
        if (String(payload?.pin || "") !== ADMIN_PIN) {
            if (cb) cb({ ok: false });
            return;
        }

        const token = crypto.randomBytes(24).toString("hex");
        adminTokens.add(token);
        if (cb) cb({ ok: true, token });
    });

    socket.on("confirmAll", (payload) => {
        if (!isAdmin(payload?.token)) return socket.emit("errorMessage", "Not banker");
        if (state.spinning) return;
        state.bets.forEach(b => b.confirmed = true);
        emitState();
    });

    socket.on("clearRound", (payload) => {
        if (!isAdmin(payload?.token)) return socket.emit("errorMessage", "Not banker");
        if (state.spinning) return;
        state.bets = [];
        emitState();
    });

    socket.on("spin", (payload) => {
        if (!isAdmin(payload?.token)) return socket.emit("errorMessage", "Not banker");
        if (state.spinning) return socket.emit("errorMessage", "Already spinning");
        if (!state.bets.length) return socket.emit("errorMessage", "No bets");
        if (state.bets.some(b => !b.confirmed)) return socket.emit("errorMessage", "Confirm payments first");

        state.spinning = true;
        const multiplier = pickMultiplier();
        const spinId = crypto.randomBytes(8).toString("hex");
        const startedAt = Date.now();

        io.emit("spinStarted", { spinId, multiplier, startedAt });
        emitState();

        setTimeout(() => {
            const results = state.bets.map(b => {
                const payout = Math.floor(Number(b.amount) * multiplier);
                return {
                    playerId: b.playerId,
                    playerName: b.playerName,
                    amount: b.amount,
                    multiplier,
                    payout,
                    profit: payout - b.amount
                };
            });

            state.history.unshift({ spinId, multiplier, results, createdAt: Date.now() });
            state.history = state.history.slice(0, 20);
            state.bets = [];
            state.spinning = false;
            emitState();
        }, 4300);
    });
});

httpServer.listen(PORT, () => {
    console.log(`TT Shared Wheel server running on port ${PORT}`);
    console.log(`Banker PIN: ${ADMIN_PIN}`);
});
