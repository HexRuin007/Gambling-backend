import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = process.env.PORT || 8080;
const ADMIN_PIN = process.env.ADMIN_PIN || "42069";
const SPIN_DURATION_MS = 4300;

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "X-Banker-Pin"] }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const adminTokens = new Set();

const wheel = [
    { multiplier: 0,    weight: 12 },
    { multiplier: 0.1,  weight: 12 },
    { multiplier: 0.25, weight: 11 },
    { multiplier: 0.5,  weight: 10 },
    { multiplier: 0.75, weight: 10 },

    { multiplier: 1,    weight: 5 },

    { multiplier: 1.25, weight: 15 },
    { multiplier: 1.5,  weight: 10 },
    { multiplier: 2,    weight: 7 },
    { multiplier: 3,    weight: 4 },
    { multiplier: 5,    weight: 3 },
    { multiplier: 10,   weight: 1 }
];

const state = {
    wheel: {
        bets: [],
        history: [],
        spinning: false,
        activeSpin: null
    },
    blackjack: {
        bets: [],
        players: [],
        dealerHand: [],
        deck: [],
        status: "waiting", // waiting, playing, finished
        currentTurnIndex: 0,
        history: []
    },
    racing: {
        horses: [
            { id: "Nunu", name: "Nunu Royale" },
            { id: "Pxpe", name: "Pxpe Express" },
            { id: "phantom", name: "Paleto Phantom" },
            { id: "rocket", name: "Sandy Rocket" },
            { id: "storm", name: "Vespucci Storm" },
            { id: "bullet", name: "LS Bullet" }
        ],
        bets: [],
        history: [],
        racing: false,
        activeRace: null
    }
};

function pickMultiplier() {
    const total = wheel.reduce((sum, item) => sum + item.weight, 0);
    let roll = crypto.randomInt(1, total + 1);

    for (const item of wheel) {
        roll -= item.weight;
        if (roll <= 0) return item.multiplier;
    }

    return 1;
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

function publicWheelState() {
    return {
        bets: state.wheel.bets,
        history: state.wheel.history,
        spinning: state.wheel.spinning,
        activeSpin: state.wheel.activeSpin,
        wheel: wheel.map(item => item.multiplier)
    };
}

function makeDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }

    for (let i = deck.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function drawCard() {
    if (!state.blackjack.deck.length) state.blackjack.deck = makeDeck();
    return state.blackjack.deck.pop();
}

function handValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.rank === "A") {
            total += 11;
            aces += 1;
        } else if (["K", "Q", "J"].includes(card.rank)) {
            total += 10;
        } else {
            total += Number(card.rank);
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    return total;
}

function activeBlackjackPlayer() {
    if (state.blackjack.status !== "playing") return null;
    return state.blackjack.players[state.blackjack.currentTurnIndex] || null;
}

function moveToNextBlackjackTurn() {
    while (state.blackjack.currentTurnIndex < state.blackjack.players.length - 1) {
        state.blackjack.currentTurnIndex += 1;
        const player = state.blackjack.players[state.blackjack.currentTurnIndex];
        if (player && player.status === "playing") return;
    }

    finishBlackjackRound();
}

function finishBlackjackRound() {
    const bj = state.blackjack;

    bj.status = "finished";
    bj.currentTurnIndex = -1;

    while (handValue(bj.dealerHand) < 17) {
        bj.dealerHand.push(drawCard());
    }

    const dealerTotal = handValue(bj.dealerHand);
    const dealerBust = dealerTotal > 21;

    bj.players.forEach(player => {
        const total = handValue(player.hand);
        let result = "lose";
        let payout = 0;

        if (total > 21) {
            result = "bust";
            payout = 0;
        } else if (dealerBust || total > dealerTotal) {
            result = "win";
            payout = player.blackjack ? Math.floor(player.amount * 2.5) : player.amount * 2;
        } else if (total === dealerTotal) {
            result = "push";
            payout = player.amount;
        } else {
            result = "lose";
            payout = 0;
        }

        player.status = result;
        player.payout = payout;
        player.profit = payout - player.amount;
    });

    bj.history.unshift({
        createdAt: Date.now(),
        dealerHand: bj.dealerHand,
        dealerTotal,
        results: bj.players.map(p => ({
            playerId: p.playerId,
            playerName: p.playerName,
            amount: p.amount,
            hand: p.hand,
            total: handValue(p.hand),
            result: p.status,
            payout: p.payout,
            profit: p.profit
        }))
    });
    bj.history = bj.history.slice(0, 20);
}

function publicBlackjackState() {
    const bj = state.blackjack;
    const active = activeBlackjackPlayer();

    return {
        bets: bj.bets,
        players: bj.players.map(p => ({
            playerId: p.playerId,
            playerName: p.playerName,
            amount: p.amount,
            hand: p.hand,
            total: handValue(p.hand),
            status: p.status,
            payout: p.payout || 0,
            profit: p.profit || 0,
            blackjack: !!p.blackjack
        })),
        dealerHand: bj.status === "playing" ? [bj.dealerHand[0], { rank: "?", suit: "" }] : bj.dealerHand,
        dealerTotal: bj.status === "playing" ? null : handValue(bj.dealerHand),
        status: bj.status,
        currentTurnId: active ? active.playerId : "",
        currentTurnName: active ? active.playerName : "",
        history: bj.history
    };
}


function publicRacingState() {
    const race = state.racing;
    return {
        horses: race.horses,
        bets: race.bets,
        history: race.history,
        racing: race.racing,
        activeRace: race.activeRace
    };
}

function finishHorseRace(raceId) {
    const race = state.racing;
    const active = race.activeRace;
    if (!active || active.raceId !== raceId) return;

    race.history.unshift({
        raceId,
        winnerHorseId: active.winnerHorseId,
        winnerHorseName: active.winnerHorseName,
        results: active.results,
        placements: active.placements,
        createdAt: Date.now()
    });
    race.history = race.history.slice(0, 30);
    race.bets = [];
    race.racing = false;
    race.activeRace = null;
}
function publicState() {
    return {
        wheel: publicWheelState(),
        blackjack: publicBlackjackState(),
        racing: publicRacingState()
    };
}

function finishWheelSpin(spinId) {
    const active = state.wheel.activeSpin;
    if (!active || active.spinId !== spinId) return;

    const results = active.results.map(r => ({ ...r }));
    state.wheel.history.unshift({ spinId, results, createdAt: Date.now() });
    state.wheel.history = state.wheel.history.slice(0, 50);
    state.wheel.bets = [];
    state.wheel.spinning = false;
    state.wheel.activeSpin = null;
}

app.get("/", (req, res) => {
    res.json({ ok: true, app: "TT Shared Casino", wheelBets: state.wheel.bets.length, blackjackStatus: state.blackjack.status, racingBets: state.racing.bets.length, racing: state.racing.racing });
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/state", (req, res) => res.json({ ok: true, state: publicState() }));

app.post("/admin-login", (req, res) => {
    if (String(req.body?.pin || "") !== ADMIN_PIN) {
        return res.status(403).json({ ok: false, error: "Bad PIN" });
    }

    const token = crypto.randomBytes(24).toString("hex");
    adminTokens.add(token);
    res.json({ ok: true, token });
});

// Wheel routes
app.post("/place-bet", (req, res) => {
    if (state.wheel.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    const playerId = String(req.body?.playerId || req.body?.playerName || crypto.randomBytes(4).toString("hex")).slice(0, 80);
    const playerName = String(req.body?.playerName || "Player").trim().slice(0, 60);
    const amount = Math.floor(Number(req.body?.amount || 0));

    if (!playerName || amount < 1) return res.status(400).json({ ok: false, error: "Invalid bet" });

    const existing = state.wheel.bets.find(b => b.playerId === playerId);
    if (existing) {
        existing.playerName = playerName;
        existing.amount = amount;
        existing.confirmed = false;
        existing.updatedAt = Date.now();
    } else {
        state.wheel.bets.push({ playerId, playerName, amount, confirmed: false, createdAt: Date.now() });
    }

    res.json({ ok: true, state: publicState() });
});

app.post("/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.wheel.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    state.wheel.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/clear-round", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.wheel.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    state.wheel.bets = [];
    res.json({ ok: true, state: publicState() });
});

app.post("/spin", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.wheel.spinning) return res.status(409).json({ ok: false, error: "Already spinning" });
    if (!state.wheel.bets.length) return res.status(400).json({ ok: false, error: "No bets" });
    if (state.wheel.bets.some(b => !b.confirmed)) return res.status(400).json({ ok: false, error: "Confirm payments first" });

    const spinId = crypto.randomBytes(8).toString("hex");
    const startedAt = Date.now();
    const results = state.wheel.bets.map(b => {
        const multiplier = pickMultiplier();
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

    state.wheel.spinning = true;
    state.wheel.activeSpin = { spinId, startedAt, durationMs: SPIN_DURATION_MS, results };

    setTimeout(() => finishWheelSpin(spinId), SPIN_DURATION_MS);
    res.json({ ok: true, spin: state.wheel.activeSpin, state: publicState() });
});

// Blackjack routes
app.post("/blackjack/place-bet", (req, res) => {
    const bj = state.blackjack;
    if (bj.status === "playing") return res.status(409).json({ ok: false, error: "Blackjack round already running" });

    const playerId = String(req.body?.playerId || req.body?.playerName || crypto.randomBytes(4).toString("hex")).slice(0, 80);
    const playerName = String(req.body?.playerName || "Player").trim().slice(0, 60);
    const amount = Math.floor(Number(req.body?.amount || 0));

    if (!playerName || amount < 1) return res.status(400).json({ ok: false, error: "Invalid blackjack bet" });

    const existing = bj.bets.find(b => b.playerId === playerId);
    if (existing) {
        existing.playerName = playerName;
        existing.amount = amount;
        existing.confirmed = false;
        existing.updatedAt = Date.now();
    } else {
        bj.bets.push({ playerId, playerName, amount, confirmed: false, createdAt: Date.now() });
    }

    if (bj.status === "finished") {
        bj.players = [];
        bj.dealerHand = [];
        bj.status = "waiting";
    }

    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.blackjack.status === "playing") return res.status(409).json({ ok: false, error: "Round already running" });

    state.blackjack.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/start", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const bj = state.blackjack;
    if (bj.status === "playing") return res.status(409).json({ ok: false, error: "Round already running" });
    if (!bj.bets.length) return res.status(400).json({ ok: false, error: "No blackjack bets" });
    if (bj.bets.some(b => !b.confirmed)) return res.status(400).json({ ok: false, error: "Confirm payments first" });

    bj.deck = makeDeck();
    bj.dealerHand = [drawCard(), drawCard()];
    bj.players = bj.bets.map(b => {
        const hand = [drawCard(), drawCard()];
        const total = handValue(hand);
        return {
            playerId: b.playerId,
            playerName: b.playerName,
            amount: b.amount,
            hand,
            status: total === 21 ? "stand" : "playing",
            blackjack: total === 21
        };
    });
    bj.bets = [];
    bj.status = "playing";
    bj.currentTurnIndex = 0;

    while (bj.players[bj.currentTurnIndex] && bj.players[bj.currentTurnIndex].status !== "playing") {
        bj.currentTurnIndex += 1;
    }

    if (bj.currentTurnIndex >= bj.players.length) finishBlackjackRound();

    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/hit", (req, res) => {
    const bj = state.blackjack;
    const playerId = String(req.body?.playerId || "");
    const player = activeBlackjackPlayer();

    if (!player || player.playerId !== playerId) return res.status(403).json({ ok: false, error: "Not your turn" });

    player.hand.push(drawCard());
    const total = handValue(player.hand);
    if (total > 21) {
        player.status = "bust";
        moveToNextBlackjackTurn();
    }

    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/stand", (req, res) => {
    const playerId = String(req.body?.playerId || "");
    const player = activeBlackjackPlayer();

    if (!player || player.playerId !== playerId) return res.status(403).json({ ok: false, error: "Not your turn" });

    player.status = "stand";
    moveToNextBlackjackTurn();
    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/reset", (req, res) => {
    if (!requireAdmin(req, res)) return;

    state.blackjack.bets = [];
    state.blackjack.players = [];
    state.blackjack.dealerHand = [];
    state.blackjack.deck = [];
    state.blackjack.status = "waiting";
    state.blackjack.currentTurnIndex = 0;

    res.json({ ok: true, state: publicState() });
});


// Horse racing routes
app.post("/racing/place-bet", (req, res) => {
    const race = state.racing;
    if (race.racing) return res.status(409).json({ ok: false, error: "Race already running" });

    const playerId = String(req.body?.playerId || req.body?.playerName || crypto.randomBytes(4).toString("hex")).slice(0, 80);
    const playerName = String(req.body?.playerName || "Player").trim().slice(0, 60);
    const amount = Math.floor(Number(req.body?.amount || 0));
    const horseId = String(req.body?.horseId || "");
    const horse = race.horses.find(h => h.id === horseId);

    if (!playerName || amount < 1) return res.status(400).json({ ok: false, error: "Invalid race bet" });
    if (!horse) return res.status(400).json({ ok: false, error: "Choose a horse" });

    const existing = race.bets.find(b => b.playerId === playerId);
    if (existing) {
        existing.playerName = playerName;
        existing.amount = amount;
        existing.horseId = horse.id;
        existing.horseName = horse.name;
        existing.confirmed = false;
        existing.updatedAt = Date.now();
    } else {
        race.bets.push({ playerId, playerName, amount, horseId: horse.id, horseName: horse.name, confirmed: false, createdAt: Date.now() });
    }

    res.json({ ok: true, state: publicState() });
});

app.post("/racing/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.racing.racing) return res.status(409).json({ ok: false, error: "Race already running" });

    state.racing.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/racing/clear", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.racing.racing) return res.status(409).json({ ok: false, error: "Race already running" });

    state.racing.bets = [];
    res.json({ ok: true, state: publicState() });
});

app.post("/racing/start", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const race = state.racing;
    if (race.racing) return res.status(409).json({ ok: false, error: "Race already running" });
    if (!race.bets.length) return res.status(400).json({ ok: false, error: "No racing bets" });
    if (race.bets.some(b => !b.confirmed)) return res.status(400).json({ ok: false, error: "Confirm payments first" });

    const raceId = crypto.randomBytes(8).toString("hex");
    const shuffled = race.horses.map(h => ({ ...h, speed: crypto.randomInt(70, 101), burst: crypto.randomInt(0, 31) }))
        .sort((a, b) => (b.speed + b.burst) - (a.speed + a.burst));
    const winner = shuffled[0];
    const odds = Math.max(2, Math.floor((race.horses.length - 1) * 1.25));

    const results = race.bets.map(b => {
        const won = b.horseId === winner.id;
        const payout = won ? b.amount * odds : 0;
        return {
            playerId: b.playerId,
            playerName: b.playerName,
            amount: b.amount,
            horseId: b.horseId,
            horseName: b.horseName,
            won,
            payout,
            profit: payout - b.amount
        };
    });

    race.racing = true;
    race.activeRace = {
        raceId,
        startedAt: Date.now(),
        durationMs: 6500,
        winnerHorseId: winner.id,
        winnerHorseName: winner.name,
        placements: shuffled.map((h, index) => ({ place: index + 1, id: h.id, name: h.name })),
        results
    };

    setTimeout(() => finishHorseRace(raceId), race.activeRace.durationMs);
    res.json({ ok: true, race: race.activeRace, state: publicState() });
});

app.listen(PORT, () => {
    console.log(`TT Shared Casino server running on port ${PORT}`);
    console.log(`Banker PIN: ${ADMIN_PIN}`);
});
