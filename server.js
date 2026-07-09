import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = process.env.PORT || 8080;
const ADMIN_PIN = process.env.ADMIN_PIN || "42069";
const ALLOWED_BANKER_IDS = (process.env.ALLOWED_BANKER_IDS || "229051,207252")
    .split(",")
    .map(id => String(id).trim())
    .filter(Boolean);
const SPIN_DURATION_MS = 4300;

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "X-Banker-Pin"] }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const adminTokens = new Map();

const state = {
    bets: [],
    history: [],
    spinning: false,
    activeSpin: null
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
        bets: state.bets.map(b => ({
            playerId: b.playerId,
            playerName: b.playerName,
            amount: b.amount,
            confirmed: b.confirmed,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
            outcomeMode: b.outcomeMode || "random"
        })),
        history: state.history,
        spinning: state.spinning,
        activeSpin: state.activeSpin,
        wheel: wheel.map(item => item.multiplier)
    };
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

function isAllowedBankerId(bankerId) {
    return ALLOWED_BANKER_IDS.includes(String(bankerId || ""));
}

function isAdminToken(token) {
    return token && adminTokens.has(String(token));
}

function getToken(req) {
    return String(req.headers.authorization || req.body?.token || "").replace(/^Bearer\s+/i, "").trim();
}

function requireAdmin(req, res) {
    const token = getToken(req);
    if (!isAdminToken(token)) {
        res.status(403).json({ ok: false, error: "Not banker" });
        return false;
    }
    return true;
}

function pickForcedMultiplier(mode) {
    const cleanMode = String(mode || "random").toLowerCase();

    if (cleanMode === "win") {
        const winningOptions = wheel.filter(item => Number(item.multiplier) > 1);
        return pickMultiplierFromOptions(winningOptions.length ? winningOptions : wheel);
    }

    if (cleanMode === "lose") {
        const losingOptions = wheel.filter(item => Number(item.multiplier) < 1);
        return pickMultiplierFromOptions(losingOptions.length ? losingOptions : wheel);
    }

    return pickMultiplier();
}

function pickMultiplierFromOptions(options) {
    const total = options.reduce((sum, item) => sum + item.weight, 0);
    let roll = crypto.randomInt(1, total + 1);

    for (const item of options) {
        roll -= item.weight;
        if (roll <= 0) return item.multiplier;
    }

    return options[0]?.multiplier ?? 1;
}

function buildSpinResults() {
    return state.bets.map(b => {
        const outcomeMode = String(b.outcomeMode || "random").toLowerCase();
        const multiplier = pickForcedMultiplier(outcomeMode);
        const payout = Math.floor(Number(b.amount) * multiplier);

        return {
            playerId: b.playerId,
            playerName: b.playerName,
            amount: b.amount,
            multiplier,
            payout,
            profit: payout - b.amount,
            outcomeMode
        };
    });
}

function finishSpin(spinId) {
    if (!state.activeSpin || state.activeSpin.spinId !== spinId) return;

    const results = Array.isArray(state.activeSpin.results)
        ? state.activeSpin.results
        : buildSpinResults();

    state.history.unshift({ spinId, results, createdAt: Date.now() });
    state.history = state.history.slice(0, 50);
    state.bets = [];
    state.spinning = false;
    state.activeSpin = null;
}

app.get("/", (req, res) => {
    res.json({ ok: true, app: "TT Shared Wheel", bets: state.bets.length, spinning: state.spinning });
});

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

app.get("/state", (req, res) => {
    res.json({ ok: true, state: publicState() });
});

app.post("/place-bet", (req, res) => {
    if (state.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    const playerId = String(req.body?.playerId || req.body?.playerName || crypto.randomBytes(4).toString("hex")).slice(0, 80);
    const playerName = String(req.body?.playerName || "Player").trim().slice(0, 60);
    const amount = Math.floor(Number(req.body?.amount || 0));

    if (!playerName || amount < 1) return res.status(400).json({ ok: false, error: "Invalid bet" });

    const existing = state.bets.find(b => b.playerId === playerId);
    if (existing) {
        existing.playerName = playerName;
        existing.amount = amount;
        existing.confirmed = false;
        existing.outcomeMode = "random";
        existing.updatedAt = Date.now();
    } else {
        state.bets.push({ playerId, playerName, amount, confirmed: false, outcomeMode: "random", createdAt: Date.now() });
    }

    res.json({ ok: true, state: publicState() });
});

app.post("/admin-login", (req, res) => {
    const bankerId = String(req.body?.bankerId || "").trim();

    if (!isAllowedBankerId(bankerId)) {
        return res.status(403).json({ ok: false, error: "Not an allowed banker ID" });
    }

    if (String(req.body?.pin || "") !== ADMIN_PIN) {
        return res.status(403).json({ ok: false, error: "Bad PIN" });
    }

    const token = crypto.randomBytes(24).toString("hex");
    adminTokens.set(token, { bankerId, createdAt: Date.now() });
    res.json({ ok: true, token });
});

app.post("/set-bet-outcome", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    const playerId = String(req.body?.playerId || "").trim();
    const outcomeMode = String(req.body?.outcomeMode || "random").toLowerCase();

    if (!playerId) return res.status(400).json({ ok: false, error: "Missing player ID" });
    if (!["random", "win", "lose"].includes(outcomeMode)) {
        return res.status(400).json({ ok: false, error: "Invalid outcome mode" });
    }

    const bet = state.bets.find(b => String(b.playerId) === playerId);
    if (!bet) return res.status(404).json({ ok: false, error: "Bet not found" });

    bet.outcomeMode = outcomeMode;
    bet.updatedAt = Date.now();

    res.json({ ok: true, state: publicState() });
});

app.post("/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    state.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/clear-round", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    state.bets = [];
    res.json({ ok: true, state: publicState() });
});

app.post("/spin", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.spinning) return res.status(409).json({ ok: false, error: "Already spinning" });
    if (!state.bets.length) return res.status(400).json({ ok: false, error: "No bets" });
    if (state.bets.some(b => !b.confirmed)) return res.status(400).json({ ok: false, error: "Confirm payments first" });

    const spinId = crypto.randomBytes(8).toString("hex");
    const startedAt = Date.now();
    const results = buildSpinResults();
    const previewMultiplier = results.length ? results[0].multiplier : 1;

    state.spinning = true;
    state.activeSpin = {
        spinId,
        multiplier: previewMultiplier,
        results,
        startedAt,
        durationMs: SPIN_DURATION_MS
    };

    setTimeout(() => finishSpin(spinId), SPIN_DURATION_MS);

    res.json({ ok: true, spin: state.activeSpin, state: publicState() });
});

app.listen(PORT, () => {
    console.log(`TT Shared Wheel server running on port ${PORT}`);
    console.log(`Banker PIN: ${ADMIN_PIN}`);
    console.log(`Allowed banker IDs: ${ALLOWED_BANKER_IDS.join(", ")}`);
});
