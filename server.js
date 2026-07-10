import express from "express";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 8080;
const ADMIN_PIN = process.env.ADMIN_PIN || "42069";
const SPIN_DURATION_MS = 4300;
const RACE_DURATION_MS = 6500;
const AUTO_START_DELAY_MS = 20_000;
const MAX_CHIP_AMOUNT = 9_000_000_000_000_000;
const NEW_PLAYER_STARTING_CHIPS = 10_000_000;
const SLOT_MAX_HISTORY = 100;
const SLOT_FREE_SPINS_AWARD = { 3: 8, 4: 12, 5: 20 };
const MINES_BOARD_SIZE = 25;
const MINES_MIN_COUNT = 1;
const MINES_MAX_COUNT = 24;
const MINES_HOUSE_FACTOR = 0.97;
const MINES_MAX_HISTORY = 100;
const DATA_DIRECTORY = process.env.RAILWAY_VOLUME_MOUNT_PATH || "/app/data";
const CHIP_DATA_FILE = path.join(DATA_DIRECTORY, "casino-chips.json");
let chipSaveTimer = null;
const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "X-Banker-Pin"] }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const adminTokens = new Set();

let wheelAutoTimer = null;
let blackjackAutoTimer = null;
let racingAutoTimer = null;

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
    chips: {
    balances: {},
    playerNames: {},
    requests: [],
    transactions: []
},
    slots: {
        history: [],
        freeSpins: {},
        lastPaidBet: {}
    },

    mines: {
        games: {},
        history: []
    },

    wheel: {
        bets: [],
        history: [],
        spinning: false,
        activeSpin: null,
        autoStartAt: null
    },
    blackjack: {
        bets: [],
        players: [],
        dealerHand: [],
        deck: [],
        status: "waiting", // waiting, playing, finished
        currentTurnIndex: 0,
        history: [],
        autoStartAt: null
    },
racing: {
    horses: [
        { id: "Nunu", name: "Nunu Royale" },
        { id: "Pxpe", name: "Pxpe Express" },
        { id: "Crack", name: "WhipCrack" },
        { id: "rocket", name: "Sandy Rocket" },
        { id: "nipple", name: "Zitze Nipple" },
        { id: "famil", name: "Uncle Famil" }
    ],
    bets: [],
    history: [],
    racing: false,
    activeRace: null,
    autoStartAt: null
}
};

function loadChipData() {
    try {
        fs.mkdirSync(DATA_DIRECTORY, {
            recursive: true
        });

        if (!fs.existsSync(CHIP_DATA_FILE)) {
            console.log(
                "No saved chip file found. Starting with empty balances."
            );
            return;
        }

        const raw = fs.readFileSync(
            CHIP_DATA_FILE,
            "utf8"
        );

        const saved = JSON.parse(raw);

        if (
            saved.balances &&
            typeof saved.balances === "object"
        ) {
            state.chips.balances = saved.balances;
        }

        if (
            saved.playerNames &&
            typeof saved.playerNames === "object"
        ) {
            state.chips.playerNames = saved.playerNames;
        }

        if (Array.isArray(saved.requests)) {
            state.chips.requests = saved.requests;
        }

        if (Array.isArray(saved.transactions)) {
            state.chips.transactions =
                saved.transactions.slice(0, 200);
        }

        if (saved.slots && typeof saved.slots === "object") {
            if (Array.isArray(saved.slots.history)) {
                state.slots.history = saved.slots.history.slice(0, SLOT_MAX_HISTORY);
            }
            if (saved.slots.freeSpins && typeof saved.slots.freeSpins === "object") {
                state.slots.freeSpins = saved.slots.freeSpins;
            }
            if (saved.slots.lastPaidBet && typeof saved.slots.lastPaidBet === "object") {
                state.slots.lastPaidBet = saved.slots.lastPaidBet;
            }
        }

        if (saved.mines && typeof saved.mines === "object") {
            if (saved.mines.games && typeof saved.mines.games === "object") {
                state.mines.games = saved.mines.games;
            }

            if (Array.isArray(saved.mines.history)) {
                state.mines.history =
                    saved.mines.history.slice(0, MINES_MAX_HISTORY);
            }
        }

        console.log(
            `Loaded chip balances for ${
                Object.keys(state.chips.balances).length
            } players`
        );
    } catch (error) {
        console.error(
            "Failed to load chip data:",
            error
        );
    }
}

function saveChipDataImmediately() {
    try {
        fs.mkdirSync(DATA_DIRECTORY, {
            recursive: true
        });

        const temporaryFile =
            CHIP_DATA_FILE + ".tmp";

        const data = {
            balances: state.chips.balances,
            playerNames: state.chips.playerNames,
            requests: state.chips.requests,
            transactions: state.chips.transactions,
            slots: {
                history: state.slots.history,
                freeSpins: state.slots.freeSpins,
                lastPaidBet: state.slots.lastPaidBet
            },
            mines: {
                games: state.mines.games,
                history: state.mines.history
            },
            savedAt: Date.now()
        };

        fs.writeFileSync(
            temporaryFile,
            JSON.stringify(data, null, 2),
            "utf8"
        );

        fs.renameSync(
            temporaryFile,
            CHIP_DATA_FILE
        );
    } catch (error) {
        console.error(
            "Failed to save chip data:",
            error
        );
    }
}

function queueChipSave() {
    if (chipSaveTimer) {
        clearTimeout(chipSaveTimer);
    }

    chipSaveTimer = setTimeout(() => {
        chipSaveTimer = null;
        saveChipDataImmediately();
    }, 100);
}

function cleanPlayerId(value) {
    return String(value || "").trim().slice(0, 80);
}

function cleanPlayerName(value) {
    return String(value || "Player").trim().slice(0, 60);
}

function cleanAmount(value) {
    const amount = Math.floor(Number(value || 0));

    if (
        !Number.isSafeInteger(amount) ||
        amount < 1 ||
        amount > MAX_CHIP_AMOUNT
    ) {
        return 0;
    }

    return amount;
}

function rememberPlayer(playerId, playerName) {
    const id = cleanPlayerId(playerId);
    if (!id) return;

    const name = playerName
        ? cleanPlayerName(playerName)
        : (
            state.chips.playerNames[id] ||
            "Player"
        );

    if (playerName) {
        state.chips.playerNames[id] = name;
    }

    const isNewPlayer =
        !Object.prototype.hasOwnProperty.call(
            state.chips.balances,
            id
        );

    if (!isNewPlayer) {
        return;
    }

    state.chips.balances[id] =
        NEW_PLAYER_STARTING_CHIPS;

    state.chips.transactions.unshift({
        transactionId:
            crypto.randomBytes(8).toString("hex"),
        playerId: id,
        playerName: name,
        amount: NEW_PLAYER_STARTING_CHIPS,
        type: "welcome-bonus",
        gameType: "",
        note:
            "Automatic new-player starting chips",
        balanceAfter:
            NEW_PLAYER_STARTING_CHIPS,
        createdAt: Date.now()
    });

    state.chips.transactions =
        state.chips.transactions.slice(0, 200);

    queueChipSave();

    console.log(
        `New player ${id} received ` +
        `${NEW_PLAYER_STARTING_CHIPS} starting chips`
    );
}

function getChipBalance(playerId) {
    const id = cleanPlayerId(playerId);
    if (!id) return 0;

    rememberPlayer(id);

    return Math.max(
        0,
        Math.floor(Number(state.chips.balances[id] || 0))
    );
}

function addChipTransaction({
    playerId,
    playerName,
    amount,
    type,
    gameType = "",
    note = ""
}) {
    const transaction = {
        transactionId: crypto.randomBytes(8).toString("hex"),
        playerId,
        playerName:
            playerName ||
            state.chips.playerNames[playerId] ||
            "Player",
        amount,
        type,
        gameType,
        note,
        balanceAfter: getChipBalance(playerId),
        createdAt: Date.now()
    };

    state.chips.transactions.unshift(transaction);
    state.chips.transactions =
        state.chips.transactions.slice(0, 200);

    return transaction;
}

function creditChips(playerId, amount, options = {}) {
    const id = cleanPlayerId(playerId);
    const value = Math.floor(Number(amount || 0));

    if (
        !id ||
        !Number.isSafeInteger(value) ||
        value < 0
    ) {
        return false;
    }

    rememberPlayer(id, options.playerName);

    const current = getChipBalance(id);
    const next = current + value;

    if (
        !Number.isSafeInteger(next) ||
        next > MAX_CHIP_AMOUNT
    ) {
        return false;
    }

    state.chips.balances[id] = next;

    if (value > 0) {
        addChipTransaction({
            playerId: id,
            playerName: options.playerName,
            amount: value,
            type: options.type || "credit",
            gameType: options.gameType || "",
            note: options.note || ""
        });
    }

    queueChipSave();

    return true;
}

function debitChips(playerId, amount, options = {}) {
    const id = cleanPlayerId(playerId);
    const value = cleanAmount(amount);

    if (!id || !value) {
        return {
            ok: false,
            error: "Invalid chip amount"
        };
    }

    rememberPlayer(id, options.playerName);

    const balance = getChipBalance(id);

    if (balance < value) {
        return {
            ok: false,
            error: `Not enough chips. Balance: ${balance}`
        };
    }

    state.chips.balances[id] = balance - value;

    addChipTransaction({
        playerId: id,
        playerName: options.playerName,
        amount: -value,
        type: options.type || "bet",
        gameType: options.gameType || "",
        note: options.note || ""
    });

    queueChipSave();

    return {
        ok: true,
        balance: state.chips.balances[id]
    };
}

function replaceReservedBet(
    existing,
    newAmount,
    playerId,
    playerName,
    gameType
) {
    const oldAmount = Math.floor(
        Number(existing?.amount || 0)
    );

    const difference = newAmount - oldAmount;

    if (difference > 0) {
        return debitChips(
            playerId,
            difference,
            {
                playerName,
                type: "bet-adjustment",
                gameType,
                note: `Increased ${gameType} bet`
            }
        );
    }

    if (difference < 0) {
        const refunded = creditChips(
            playerId,
            Math.abs(difference),
            {
                playerName,
                type: "bet-refund",
                gameType,
                note: `Reduced ${gameType} bet`
            }
        );

        if (!refunded) {
            return {
                ok: false,
                error: "Could not refund chip difference"
            };
        }
    }

    return {
        ok: true,
        balance: getChipBalance(playerId)
    };
}

function refundBets(bets, gameType, note) {
    for (const bet of bets || []) {
        creditChips(
            bet.playerId,
            Number(bet.amount || 0),
            {
                playerName: bet.playerName,
                type: "bet-refund",
                gameType,
                note
            }
        );
    }
}

function publicChipState() {
    return {
        balances: {
            ...state.chips.balances
        },

        playerNames: {
            ...state.chips.playerNames
        },

        requests: state.chips.requests.map(
            request => ({ ...request })
        ),

        transactions: state.chips.transactions
            .slice(0, 50)
            .map(transaction => ({ ...transaction }))
    }
};



const SLOT_SYMBOLS = [
    // More common matching symbols and much stronger line payouts.
    // Payline wins still use 1/10th of the total bet per line.
    { id: "pear", label: "🍐", weight: 34, pays: { 3: 4, 4: 12, 5: 40 } },
    { id: "cherry", label: "🍒", weight: 28, pays: { 3: 5, 4: 16, 5: 55 } },
    { id: "bell", label: "🔔", weight: 22, pays: { 3: 6, 4: 22, 5: 75 } },
    { id: "gem", label: "💎", weight: 16, pays: { 3: 8, 4: 30, 5: 110 } },
    { id: "crown", label: "👑", weight: 11, pays: { 3: 10, 4: 45, 5: 180 } },
    { id: "seven", label: "7️⃣", weight: 7, pays: { 3: 15, 4: 70, 5: 300 } },
    { id: "wild", label: "🃏", weight: 5, pays: { 3: 20, 4: 100, 5: 500 } },

    // Scatter payouts use the full total bet rather than the per-line bet.
    { id: "scatter", label: "⭐", weight: 5, pays: { 3: 3, 4: 12, 5: 50 } }
];

const SLOT_PAYLINES = [
    [1,1,1,1,1], [0,0,0,0,0], [2,2,2,2,2], [0,1,2,1,0], [2,1,0,1,2],
    [0,0,1,2,2], [2,2,1,0,0], [1,0,0,0,1], [1,2,2,2,1], [0,1,1,1,0]
];

function pickSlotSymbol() {
    const total = SLOT_SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
    let roll = crypto.randomInt(1, total + 1);
    for (const symbol of SLOT_SYMBOLS) {
        roll -= symbol.weight;
        if (roll <= 0) return symbol.id;
    }
    return "pear";
}

function createSlotGrid() {
    return Array.from({ length: 3 }, () =>
        Array.from({ length: 5 }, () => pickSlotSymbol())
    );
}

function pickSlotNonScatterSymbol() {
    let symbol = pickSlotSymbol();

    while (symbol === "scatter") {
        symbol = pickSlotSymbol();
    }

    return symbol;
}

function findScatterCells(grid) {
    const cells = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            if (grid[row][col] === "scatter") {
                cells.push({ row, col });
            }
        }
    }

    return cells;
}

function canStartScatterNudge(grid) {
    const scatters = findScatterCells(grid);

    return (
        scatters.length === 2 &&
        scatters[0].col !== scatters[1].col &&
        scatters.every(cell => cell.row < 2)
    );
}

function createScatterNudgeStep(previousGrid, lockedScatters) {
    const nextGrid = previousGrid.map(row => [...row]);
    const lockedColumns = new Set(
        lockedScatters.map(cell => cell.col)
    );

    // Only unlocked reels spin again.
    for (let col = 0; col < 5; col++) {
        if (lockedColumns.has(col)) continue;

        for (let row = 0; row < 3; row++) {
            nextGrid[row][col] = pickSlotSymbol();
        }
    }

    const movedScatters = lockedScatters.map(cell => {
        const nextRow = Math.min(2, cell.row + 1);

        if (nextRow !== cell.row) {
            nextGrid[cell.row][cell.col] =
                pickSlotNonScatterSymbol();

            nextGrid[nextRow][cell.col] =
                "scatter";
        }

        return {
            row: nextRow,
            col: cell.col
        };
    });

    return {
        grid: nextGrid,
        lockedScatters: movedScatters
    };
}

function runScatterNudgeFeature(initialGrid) {
    if (!canStartScatterNudge(initialGrid)) {
        return {
            triggered: false,
            finalGrid: initialGrid,
            steps: []
        };
    }

    let currentGrid = initialGrid.map(row => [...row]);
    let lockedScatters = findScatterCells(currentGrid);
    const steps = [];

    // A scatter can move at most twice: top -> middle -> bottom.
    for (let attempt = 1; attempt <= 2; attempt++) {
        if (!lockedScatters.some(cell => cell.row < 2)) {
            break;
        }

        const step = createScatterNudgeStep(
            currentGrid,
            lockedScatters
        );

        currentGrid = step.grid;
        lockedScatters = step.lockedScatters;

        const scatterCount =
            findScatterCells(currentGrid).length;

        steps.push({
            attempt,
            grid: currentGrid.map(row => [...row]),
            lockedColumns: lockedScatters.map(
                cell => cell.col
            ),
            lockedScatters: lockedScatters.map(
                cell => ({ ...cell })
            ),
            scatterCount,
            success: scatterCount >= 3
        });

        if (scatterCount >= 3) {
            break;
        }
    }

    return {
        triggered: true,
        finalGrid: currentGrid,
        steps
    };
}

function evaluateSlotGrid(grid, betAmount, isFreeSpin) {
    let payout = 0;
    const lineWins = [];
    const winningCells = [];
    const lineBet = betAmount / SLOT_PAYLINES.length;

    SLOT_PAYLINES.forEach((rows, lineIndex) => {
        const symbols = rows.map((row, col) => grid[row][col]);
        let base = symbols[0] === "wild" ? symbols.find(s => s !== "wild" && s !== "scatter") || "wild" : symbols[0];
        if (base === "scatter") return;
        let count = 0;
        for (const symbol of symbols) {
            if (symbol === base || symbol === "wild") count += 1;
            else break;
        }
        if (count >= 3) {
            const def = SLOT_SYMBOLS.find(s => s.id === base) || SLOT_SYMBOLS.find(s => s.id === "wild");
            const multiplier = Number(def.pays[count] || 0);
            const win = Math.floor(lineBet * multiplier);
            payout += win;
            lineWins.push({ line: lineIndex + 1, symbol: base, count, multiplier, win });
            for (let col = 0; col < count; col++) winningCells.push({ row: rows[col], col });
        }
    });

    const scatterCount = grid.flat().filter(symbol => symbol === "scatter").length;
    let freeSpinsAwarded = 0;
    if (scatterCount >= 3) {
        const count = Math.min(5, scatterCount);
        const scatterDef = SLOT_SYMBOLS.find(s => s.id === "scatter");
        payout += Math.floor(betAmount * Number(scatterDef.pays[count] || 0));
        freeSpinsAwarded = SLOT_FREE_SPINS_AWARD[count] || 0;
    }

    // A paid spin that is shown as a winning payline should never return
    // less than the original stake. This prevents "winning" while still
    // losing chips overall.
    let minimumWinApplied = false;

    if (
        !isFreeSpin &&
        (lineWins.length > 0 || scatterCount >= 3) &&
        payout < betAmount
    ) {
        payout = betAmount;
        minimumWinApplied = true;
    }

    let bonusMultiplier = 1;

    if (isFreeSpin && payout > 0) {
        const bonusRoll = crypto.randomInt(1, 101);

        bonusMultiplier =
            bonusRoll <= 8
                ? 10
                : bonusRoll <= 28
                    ? 5
                    : bonusRoll <= 60
                        ? 3
                        : 2;

        payout *= bonusMultiplier;
    }

    return {
        payout: Math.floor(payout),
        lineWins,
        winningCells,
        scatterCount,
        freeSpinsAwarded,
        bonusMultiplier,
        minimumWinApplied
    };
}

function publicSlotsState() {
    return {
        history: state.slots.history.slice(0, 50),
        freeSpins: { ...state.slots.freeSpins },
        paytable: SLOT_SYMBOLS.map(symbol => ({ symbol: symbol.id, label: symbol.label, pays: symbol.pays })),
        paylines: SLOT_PAYLINES.length
    };
}


function combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;

    k = Math.min(k, n - k);

    let result = 1;

    for (let i = 1; i <= k; i++) {
        result =
            (result * (n - k + i)) /
            i;
    }

    return result;
}

function getMinesMultiplier(mineCount, safeReveals) {
    if (safeReveals <= 0) return 1;

    const totalWays =
        combination(MINES_BOARD_SIZE, safeReveals);

    const safeWays =
        combination(
            MINES_BOARD_SIZE - mineCount,
            safeReveals
        );

    if (!safeWays) return 0;

    const fairMultiplier =
        totalWays / safeWays;

    return Math.max(
        1.01,
        Math.floor(
            fairMultiplier *
            MINES_HOUSE_FACTOR *
            100
        ) / 100
    );
}

function createMinePositions(mineCount) {
    const cells = Array.from(
        { length: MINES_BOARD_SIZE },
        (_, index) => index
    );

    for (let i = cells.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [cells[i], cells[j]] =
            [cells[j], cells[i]];
    }

    return cells.slice(0, mineCount);
}

function publicMineGame(game) {
    if (!game) return null;

    return {
        gameId: game.gameId,
        playerId: game.playerId,
        playerName: game.playerName,
        betAmount: game.betAmount,
        mineCount: game.mineCount,
        revealed: [...game.revealed],
        safeReveals: game.safeReveals,
        revealed: [...game.revealed],
        multiplier: getMinesMultiplier(
            game.mineCount,
            game.safeReveals
        ),
        potentialPayout: Math.floor(
            game.betAmount *
            getMinesMultiplier(
                game.mineCount,
                game.safeReveals
            )
        ),
        status: game.status,
        createdAt: game.createdAt
    };
}

function publicMinesState() {
    const games = {};

    for (const [playerId, game] of Object.entries(
        state.mines.games
    )) {
        games[playerId] = publicMineGame(game);
    }

    return {
        boardSize: MINES_BOARD_SIZE,
        minimumMines: MINES_MIN_COUNT,
        maximumMines: MINES_MAX_COUNT,
        games,
        history: state.mines.history
            .slice(0, 50)
            .map(entry => ({ ...entry }))
    };
}

function finishMineGame(game, result, payout, hitCell = null) {
    const historyEntry = {
        gameId: game.gameId,
        playerId: game.playerId,
        playerName: game.playerName,
        betAmount: game.betAmount,
        mineCount: game.mineCount,
        safeReveals: game.safeReveals,
        multiplier:
            result === "cashout" ||
            result === "cleared"
                ? getMinesMultiplier(
                    game.mineCount,
                    game.safeReveals
                )
                : 0,
        payout,
        profit: payout - game.betAmount,
        result,
        hitCell,
        minePositions:
            result === "mine"
                ? [...game.minePositions]
                : undefined,
        createdAt: Date.now()
    };

    state.mines.history.unshift(historyEntry);
    state.mines.history =
        state.mines.history.slice(
            0,
            MINES_MAX_HISTORY
        );

    delete state.mines.games[game.playerId];
    queueChipSave();

    return historyEntry;
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
        autoStartAt: state.wheel.autoStartAt,
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
    if (bj.status !== "playing") return;

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
        if (payout > 0) {
    creditChips(
        player.playerId,
        payout,
        {
            playerName: player.playerName,
            type: "payout",
            gameType: "blackjack",
            note:
                result === "push"
                    ? "Blackjack bet returned"
                    : "Blackjack winnings"
        }
    );
}
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
        history: bj.history,
        autoStartAt: bj.autoStartAt
    };
}


function publicRacingState() {
    const race = state.racing;
    return {
        horses: race.horses,
        bets: race.bets,
        history: race.history,
        racing: race.racing,
        activeRace: race.activeRace,
        autoStartAt: race.autoStartAt
    };
}

function finishHorseRace(raceId) {
    const race = state.racing;
    const active = race.activeRace;
    if (!active || active.raceId !== raceId) return;
    for (const result of active.results || []) {
    if (result.payout > 0) {
        creditChips(
            result.playerId,
            result.payout,
            {
                playerName: result.playerName,
                type: "payout",
                gameType: "racing",
                note: `Horse racing winnings on ${result.horseName}`
            }
        );
    }
}

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
        chips: publicChipState(),
        slots: publicSlotsState(),
        mines: publicMinesState(),
        wheel: publicWheelState(),
        blackjack: publicBlackjackState(),
        racing: publicRacingState()
    };
}

function finishWheelSpin(spinId) {
    const active = state.wheel.activeSpin;

    if (!active || active.spinId !== spinId) {
        return;
    }

    const results = active.results.map(
        result => ({ ...result })
    );

    for (const result of results) {
        if (result.payout > 0) {
            creditChips(
                result.playerId,
                result.payout,
                {
                    playerName: result.playerName,
                    type: "payout",
                    gameType: "wheel",
                    note: `Wheel result x${result.multiplier}`
                }
            );
        }
    }

    state.wheel.history.unshift({
        spinId,
        results,
        createdAt: Date.now()
    });

    state.wheel.history =
        state.wheel.history.slice(0, 50);

    state.wheel.bets = [];
    state.wheel.spinning = false;
    state.wheel.activeSpin = null;
}


function startWheelSpin() {
    if (state.wheel.spinning) {
        return { ok: false, error: "Already spinning" };
    }

    if (!state.wheel.bets.length) {
        return { ok: false, error: "No bets" };
    }

    state.wheel.bets.forEach(bet => {
        bet.confirmed = true;
    });

    const spinId = crypto.randomBytes(8).toString("hex");
    const startedAt = Date.now();

    const results = state.wheel.bets.map(bet => {
        const multiplier = pickMultiplier();
        const payout = Math.floor(Number(bet.amount) * multiplier);

        return {
            playerId: bet.playerId,
            playerName: bet.playerName,
            amount: bet.amount,
            multiplier,
            payout,
            profit: payout - bet.amount
        };
    });

    state.wheel.autoStartAt = null;
    state.wheel.spinning = true;
    state.wheel.activeSpin = {
        spinId,
        startedAt,
        durationMs: SPIN_DURATION_MS,
        results
    };

    setTimeout(() => finishWheelSpin(spinId), SPIN_DURATION_MS);

    return {
        ok: true,
        spin: state.wheel.activeSpin
    };
}

function startBlackjackRound() {
    const bj = state.blackjack;

    if (bj.status === "playing") {
        return { ok: false, error: "Round already running" };
    }

    if (!bj.bets.length) {
        return { ok: false, error: "No blackjack bets" };
    }

    bj.bets.forEach(bet => {
        bet.confirmed = true;
    });

    bj.autoStartAt = null;
    bj.deck = makeDeck();
    bj.dealerHand = [drawCard(), drawCard()];

    bj.players = bj.bets.map(bet => {
        const hand = [drawCard(), drawCard()];
        const total = handValue(hand);

        return {
            playerId: bet.playerId,
            playerName: bet.playerName,
            amount: bet.amount,
            hand,
            status: total === 21 ? "stand" : "playing",
            blackjack: total === 21
        };
    });

    bj.bets = [];
    bj.status = "playing";
    bj.currentTurnIndex = 0;

    while (
        bj.players[bj.currentTurnIndex] &&
        bj.players[bj.currentTurnIndex].status !== "playing"
    ) {
        bj.currentTurnIndex += 1;
    }

    if (bj.currentTurnIndex >= bj.players.length) {
        finishBlackjackRound();
    }

    return { ok: true };
}

function startHorseRace() {
    const race = state.racing;

    if (race.racing) {
        return { ok: false, error: "Race already running" };
    }

    if (!race.bets.length) {
        return { ok: false, error: "No racing bets" };
    }

    race.bets.forEach(bet => {
        bet.confirmed = true;
    });

    const raceId = crypto.randomBytes(8).toString("hex");

    const shuffled = race.horses
        .map(horse => ({
            ...horse,
            speed: crypto.randomInt(70, 101),
            burst: crypto.randomInt(0, 31)
        }))
        .sort(
            (a, b) =>
                (b.speed + b.burst) -
                (a.speed + a.burst)
        );

    const winner = shuffled[0];
    const odds = Math.max(
        2,
        Math.floor((race.horses.length - 1) * 1.25)
    );

    const results = race.bets.map(bet => {
        const won = bet.horseId === winner.id;
        const payout = won ? bet.amount * odds : 0;

        return {
            playerId: bet.playerId,
            playerName: bet.playerName,
            amount: bet.amount,
            horseId: bet.horseId,
            horseName: bet.horseName,
            won,
            payout,
            profit: payout - bet.amount
        };
    });

    race.autoStartAt = null;
    race.racing = true;
    race.activeRace = {
        raceId,
        startedAt: Date.now(),
        durationMs: RACE_DURATION_MS,
        winnerHorseId: winner.id,
        winnerHorseName: winner.name,
        placements: shuffled.map((horse, index) => ({
            place: index + 1,
            id: horse.id,
            name: horse.name
        })),
        results
    };

    setTimeout(
        () => finishHorseRace(raceId),
        RACE_DURATION_MS
    );

    return {
        ok: true,
        race: race.activeRace
    };
}

function scheduleWheelAutoStart() {
    if (
        wheelAutoTimer ||
        state.wheel.spinning ||
        !state.wheel.bets.length
    ) {
        return;
    }

    state.wheel.autoStartAt = Date.now() + AUTO_START_DELAY_MS;

    wheelAutoTimer = setTimeout(() => {
        wheelAutoTimer = null;
        state.wheel.autoStartAt = null;

        if (
            state.wheel.spinning ||
            !state.wheel.bets.length
        ) {
            return;
        }

        startWheelSpin();
    }, AUTO_START_DELAY_MS);
}

function scheduleBlackjackAutoStart() {
    const bj = state.blackjack;

    if (
        blackjackAutoTimer ||
        bj.status === "playing" ||
        !bj.bets.length
    ) {
        return;
    }

    bj.autoStartAt = Date.now() + AUTO_START_DELAY_MS;

    blackjackAutoTimer = setTimeout(() => {
        blackjackAutoTimer = null;
        bj.autoStartAt = null;

        if (
            bj.status === "playing" ||
            !bj.bets.length
        ) {
            return;
        }

        startBlackjackRound();
    }, AUTO_START_DELAY_MS);
}

function scheduleRacingAutoStart() {
    const race = state.racing;

    if (
        racingAutoTimer ||
        race.racing ||
        !race.bets.length
    ) {
        return;
    }

    race.autoStartAt = Date.now() + AUTO_START_DELAY_MS;

    racingAutoTimer = setTimeout(() => {
        racingAutoTimer = null;
        race.autoStartAt = null;

        if (
            race.racing ||
            !race.bets.length
        ) {
            return;
        }

        startHorseRace();
    }, AUTO_START_DELAY_MS);
}

app.get("/", (req, res) => {
    res.json({ ok: true, app: "TT Shared Casino", wheelBets: state.wheel.bets.length, blackjackStatus: state.blackjack.status, racingBets: state.racing.bets.length, racing: state.racing.racing });
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/state", (req, res) => {
    res.json({
        ok: true,
        serverTime: Date.now(),
        state: publicState()
    });
});

app.post("/admin-login", (req, res) => {
    if (String(req.body?.pin || "") !== ADMIN_PIN) {
        return res.status(403).json({ ok: false, error: "Bad PIN" });
    }

    const token = crypto.randomBytes(24).toString("hex");
    adminTokens.add(token);
    res.json({ ok: true, token });
});

// Chip routes

app.post("/chips/request", (req, res) => {
    const playerId = cleanPlayerId(req.body?.playerId);
    const playerName = cleanPlayerName(
        req.body?.playerName
    );
    const amount = cleanAmount(req.body?.amount);

    if (!playerId || !playerName || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid chip request"
        });
    }

    rememberPlayer(playerId, playerName);

    const existing = state.chips.requests.find(
        request =>
            request.playerId === playerId &&
            request.status === "pending"
    );

    if (existing) {
        existing.playerName = playerName;
        existing.amount = amount;
        existing.updatedAt = Date.now();
        queueChipSave();

        return res.json({
            ok: true,
            request: existing,
            state: publicState()
        });
    }

    const request = {
        requestId: crypto.randomBytes(8).toString("hex"),
        playerId,
        playerName,
        amount,
        status: "pending",
        createdAt: Date.now()
    };

    state.chips.requests.push(request);
    queueChipSave();

    res.json({
        ok: true,
        request,
        state: publicState()
    });
});

app.post("/chips/grant", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const requestId = String(
        req.body?.requestId || ""
    ).trim();

    let playerId = cleanPlayerId(req.body?.playerId);
    let playerName = cleanPlayerName(
        req.body?.playerName
    );
    let amount = cleanAmount(req.body?.amount);

    let request = null;

    if (requestId) {
        request = state.chips.requests.find(
            item =>
                item.requestId === requestId &&
                item.status === "pending"
        );

        if (!request) {
            return res.status(404).json({
                ok: false,
                error: "Chip request not found"
            });
        }

        playerId = request.playerId;
        playerName = request.playerName;
        amount = request.amount;
    }

    if (!playerId || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid player or chip amount"
        });
    }

    const granted = creditChips(
        playerId,
        amount,
        {
            playerName,
            type: "banker-grant",
            note: request
                ? "Chip purchase request approved"
                : "Chips manually granted by banker"
        }
    );

    if (!granted) {
        return res.status(400).json({
            ok: false,
            error: "Could not grant chips"
        });
    }

    if (request) {
        state.chips.requests =
            state.chips.requests.filter(
                item => item.requestId !== request.requestId
            );

        queueChipSave();
    }

    res.json({
        ok: true,
        playerId,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});
app.post("/chips/cashout", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const playerId = cleanPlayerId(req.body?.playerId);
    const playerName = cleanPlayerName(
        req.body?.playerName ||
        state.chips.playerNames[playerId] ||
        "Player"
    );
    const amount = cleanAmount(req.body?.amount);

    if (!playerId || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid player ID or cash-out amount"
        });
    }

    rememberPlayer(playerId, playerName);

    const currentBalance = getChipBalance(playerId);

    if (currentBalance < amount) {
        return res.status(400).json({
            ok: false,
            error: `Player only has ${currentBalance} chips`
        });
    }

    const removed = debitChips(
        playerId,
        amount,
        {
            playerName,
            type: "cashout",
            gameType: "",
            note: "Chips removed after cash out"
        }
    );

    if (!removed.ok) {
        return res.status(400).json({
            ok: false,
            error: removed.error
        });
    }

    res.json({
        ok: true,
        playerId,
        playerName,
        amountRemoved: amount,
        previousBalance: currentBalance,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/chips/reject", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const requestId = String(
        req.body?.requestId || ""
    ).trim();

    const request = state.chips.requests.find(
        item =>
            item.requestId === requestId &&
            item.status === "pending"
    );

    if (!request) {
        return res.status(404).json({
            ok: false,
            error: "Chip request not found"
        });
    }

    state.chips.requests =
        state.chips.requests.filter(
            item => item.requestId !== requestId
        );

    queueChipSave();

    res.json({
        ok: true,
        state: publicState()
    });
});

app.post("/chips/set-balance", (req, res) => {
    if (!requireAdmin(req, res)) return;

    const playerId = cleanPlayerId(req.body?.playerId);
    const playerName = cleanPlayerName(
        req.body?.playerName
    );

    const balance = Math.floor(
        Number(req.body?.balance)
    );

    if (
        !playerId ||
        !Number.isSafeInteger(balance) ||
        balance < 0 ||
        balance > MAX_CHIP_AMOUNT
    ) {
        return res.status(400).json({
            ok: false,
            error: "Invalid balance"
        });
    }

    rememberPlayer(playerId, playerName);

    const previousBalance = getChipBalance(playerId);
    state.chips.balances[playerId] = balance;

    addChipTransaction({
        playerId,
        playerName,
        amount: balance - previousBalance,
        type: "balance-set",
        note: "Balance manually set by banker"
    });

    queueChipSave();

    res.json({
        ok: true,
        playerId,
        balance,
        state: publicState()
    });
});

// Slot routes
app.post("/slots/spin", (req, res) => {
    const playerId = cleanPlayerId(req.body?.playerId);
    const playerName = cleanPlayerName(req.body?.playerName);
    const requestedAmount = cleanAmount(req.body?.amount);

    if (!playerId || !playerName) {
        return res.status(400).json({ ok: false, error: "Invalid player" });
    }

    rememberPlayer(playerId, playerName);

    const availableFreeSpins = Math.max(0, Math.floor(Number(state.slots.freeSpins[playerId] || 0)));
    const isFreeSpin = availableFreeSpins > 0;
    let betAmount = requestedAmount;

    if (isFreeSpin) {
        betAmount = Math.floor(Number(state.slots.lastPaidBet[playerId] || requestedAmount || 0));
        if (!betAmount) {
            return res.status(400).json({ ok: false, error: "Place one paid spin before using free spins" });
        }
        state.slots.freeSpins[playerId] = availableFreeSpins - 1;
    } else {
        if (!betAmount) {
            return res.status(400).json({ ok: false, error: "Invalid slot bet" });
        }
        const debited = debitChips(playerId, betAmount, {
            playerName,
            type: "bet",
            gameType: "slots",
            note: "Slot spin"
        });
        if (!debited.ok) return res.status(400).json(debited);
        state.slots.lastPaidBet[playerId] = betAmount;
    }

    const initialGrid = createSlotGrid();
    const nudgeFeature = runScatterNudgeFeature(initialGrid);
    const grid = nudgeFeature.finalGrid;
    const evaluation = evaluateSlotGrid(
        grid,
        betAmount,
        isFreeSpin
    );

    if (evaluation.freeSpinsAwarded > 0) {
        state.slots.freeSpins[playerId] =
            Math.max(0, Number(state.slots.freeSpins[playerId] || 0)) + evaluation.freeSpinsAwarded;
    }

    if (evaluation.payout > 0) {
        creditChips(playerId, evaluation.payout, {
            playerName,
            type: "payout",
            gameType: "slots",
            note: isFreeSpin ? "Slot free-spin winnings" : "Slot winnings"
        });
    }

    const result = {
        spinId: crypto.randomBytes(8).toString("hex"),
        playerId,
        playerName,
        initialGrid,
        grid,
        scatterNudgeTriggered: nudgeFeature.triggered,
        scatterNudgeSteps: nudgeFeature.steps,
        scatterNudgeAttempts: nudgeFeature.steps.length,
        betAmount,
        payout: evaluation.payout,
        profit: evaluation.payout - (isFreeSpin ? 0 : betAmount),
        freeSpin: isFreeSpin,
        freeSpinsAwarded: evaluation.freeSpinsAwarded,
        freeSpinsRemaining: state.slots.freeSpins[playerId] || 0,
        bonusMultiplier: evaluation.bonusMultiplier,
        minimumWinApplied: evaluation.minimumWinApplied,
        scatterCount: evaluation.scatterCount,
        lineWins: evaluation.lineWins,
        winningCells: evaluation.winningCells,
        message: evaluation.freeSpinsAwarded > 0
            ? nudgeFeature.triggered
                ? `Scatter nudge found the third scatter and awarded ${evaluation.freeSpinsAwarded} free spins!`
                : `${evaluation.scatterCount} scatters awarded ${evaluation.freeSpinsAwarded} free spins!`
            : nudgeFeature.triggered
                ? `Scatter nudge used ${nudgeFeature.steps.length} free respin${nudgeFeature.steps.length === 1 ? "" : "s"}, but no third scatter landed`
                : evaluation.bonusMultiplier > 1
                    ? `Free-spin bonus multiplier x${evaluation.bonusMultiplier}`
                    : evaluation.lineWins.length
                        ? `${evaluation.lineWins.length} winning payline${evaluation.lineWins.length === 1 ? "" : "s"}`
                        : "No winning combination",
        createdAt: Date.now()
    };

    state.slots.history.unshift(result);
    state.slots.history = state.slots.history.slice(0, SLOT_MAX_HISTORY);
    queueChipSave();

    res.json({
        ok: true,
        result,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});


// Mines routes

app.post("/mines/start", (req, res) => {
    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const playerName = cleanPlayerName(
        req.body?.playerName
    );

    const betAmount = cleanAmount(
        req.body?.amount
    );

    const mineCount = Math.floor(
        Number(req.body?.mineCount || 0)
    );

    if (!playerId || !playerName || !betAmount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid Mines bet"
        });
    }

    if (
        !Number.isInteger(mineCount) ||
        mineCount < MINES_MIN_COUNT ||
        mineCount > MINES_MAX_COUNT
    ) {
        return res.status(400).json({
            ok: false,
            error:
                `Choose between ${MINES_MIN_COUNT} and ` +
                `${MINES_MAX_COUNT} mines`
        });
    }

    if (state.mines.games[playerId]) {
        return res.status(409).json({
            ok: false,
            error:
                "Finish or cash out your current Mines game first"
        });
    }

    rememberPlayer(playerId, playerName);

    const debit = debitChips(
        playerId,
        betAmount,
        {
            playerName,
            type: "bet",
            gameType: "mines",
            note: `Mines game with ${mineCount} mines`
        }
    );

    if (!debit.ok) {
        return res.status(400).json(debit);
    }

    const game = {
        gameId:
            crypto.randomBytes(8).toString("hex"),
        playerId,
        playerName,
        betAmount,
        mineCount,
        minePositions:
            createMinePositions(mineCount),
        revealed: [],
        safeReveals: 0,
        status: "playing",
        createdAt: Date.now()
    };

    state.mines.games[playerId] = game;
    queueChipSave();

    res.json({
        ok: true,
        game: publicMineGame(game),
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/mines/reveal", (req, res) => {
    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const cell = Math.floor(
        Number(req.body?.cell)
    );

    const game = state.mines.games[playerId];

    if (!game) {
        return res.status(404).json({
            ok: false,
            error: "No active Mines game"
        });
    }

    if (
        !Number.isInteger(cell) ||
        cell < 0 ||
        cell >= MINES_BOARD_SIZE
    ) {
        return res.status(400).json({
            ok: false,
            error: "Invalid Mines tile"
        });
    }

    if (game.revealed.includes(cell)) {
        return res.status(400).json({
            ok: false,
            error: "Tile already revealed"
        });
    }

    if (game.minePositions.includes(cell)) {
        const history = finishMineGame(
            game,
            "mine",
            0,
            cell
        );

        return res.json({
            ok: true,
            hitMine: true,
            minePositions: [
                ...game.minePositions
            ],
            history,
            balance:
                getChipBalance(playerId),
            state: publicState()
        });
    }

    game.revealed.push(cell);
    game.safeReveals += 1;

    const safeCells =
        MINES_BOARD_SIZE - game.mineCount;

    if (game.safeReveals >= safeCells) {
        const multiplier =
            getMinesMultiplier(
                game.mineCount,
                game.safeReveals
            );

        const payout = Math.floor(
            game.betAmount * multiplier
        );

        creditChips(
            playerId,
            payout,
            {
                playerName: game.playerName,
                type: "payout",
                gameType: "mines",
                note: "Cleared every safe Mines tile"
            }
        );

        const history = finishMineGame(
            game,
            "cleared",
            payout
        );

        return res.json({
            ok: true,
            hitMine: false,
            cleared: true,
            revealedCell: cell,
            revealed: [...game.revealed],
            minePositions: [...game.minePositions],
            history,
            balance:
                getChipBalance(playerId),
            state: publicState()
        });
    }

    queueChipSave();

    res.json({
        ok: true,
        hitMine: false,
        cleared: false,
        revealedCell: cell,
        game: publicMineGame(game),
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/mines/cashout", (req, res) => {
    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const game = state.mines.games[playerId];

    if (!game) {
        return res.status(404).json({
            ok: false,
            error: "No active Mines game"
        });
    }

    if (game.safeReveals < 1) {
        return res.status(400).json({
            ok: false,
            error:
                "Reveal at least one safe tile before cashing out"
        });
    }

    const multiplier =
        getMinesMultiplier(
            game.mineCount,
            game.safeReveals
        );

    const payout = Math.floor(
        game.betAmount * multiplier
    );

    creditChips(
        playerId,
        payout,
        {
            playerName: game.playerName,
            type: "payout",
            gameType: "mines",
            note:
                `Mines cash-out at x${multiplier.toFixed(2)}`
        }
    );

    const history = finishMineGame(
        game,
        "cashout",
        payout
    );

    res.json({
        ok: true,
        payout,
        multiplier,
        minePositions: [
            ...game.minePositions
        ],
        history,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

// Wheel routes
app.post("/place-bet", (req, res) => {
    if (state.wheel.spinning) {
        return res.status(409).json({
            ok: false,
            error: "Spin already running"
        });
    }

    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const playerName = cleanPlayerName(
        req.body?.playerName
    );

    const amount = cleanAmount(
        req.body?.amount
    );

    if (!playerId || !playerName || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid bet"
        });
    }

    rememberPlayer(playerId, playerName);

    const existing = state.wheel.bets.find(
        bet => bet.playerId === playerId
    );

    if (existing) {
        const reserved = replaceReservedBet(
            existing,
            amount,
            playerId,
            playerName,
            "wheel"
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        existing.playerName = playerName;
        existing.amount = amount;
        existing.confirmed = true;
        existing.updatedAt = Date.now();
    } else {
        const reserved = debitChips(
            playerId,
            amount,
            {
                playerName,
                type: "bet",
                gameType: "wheel",
                note: "Wheel bet placed"
            }
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        state.wheel.bets.push({
            playerId,
            playerName,
            amount,
            confirmed: true,
            createdAt: Date.now()
        });
    }

    scheduleWheelAutoStart();

    res.json({
        ok: true,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.wheel.spinning) return res.status(409).json({ ok: false, error: "Spin already running" });

    state.wheel.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/clear-round", (req, res) => {
    if (!requireAdmin(req, res)) return;

    if (state.wheel.spinning) {
        return res.status(409).json({
            ok: false,
            error: "Spin already running"
        });
    }

    if (wheelAutoTimer) {
        clearTimeout(wheelAutoTimer);
        wheelAutoTimer = null;
    }

    state.wheel.autoStartAt = null;

    refundBets(
        state.wheel.bets,
        "wheel",
        "Wheel bets cleared by banker"
    );

    state.wheel.bets = [];

    res.json({
        ok: true,
        state: publicState()
    });
});

app.post("/spin", (req, res) => {
    if (!requireAdmin(req, res)) return;

    if (wheelAutoTimer) {
        clearTimeout(wheelAutoTimer);
        wheelAutoTimer = null;
    }

    state.wheel.autoStartAt = null;

    const result = startWheelSpin();

    if (!result.ok) {
        return res.status(400).json(result);
    }

    res.json({
        ok: true,
        spin: result.spin,
        state: publicState()
    });
});

// Blackjack routes
app.post("/blackjack/place-bet", (req, res) => {
    const bj = state.blackjack;

    if (bj.status === "playing") {
        return res.status(409).json({
            ok: false,
            error: "Blackjack round already running"
        });
    }

    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const playerName = cleanPlayerName(
        req.body?.playerName
    );

    const amount = cleanAmount(
        req.body?.amount
    );

    if (!playerId || !playerName || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid blackjack bet"
        });
    }

    if (bj.status === "finished") {
        bj.players = [];
        bj.dealerHand = [];
        bj.deck = [];
        bj.status = "waiting";
        bj.currentTurnIndex = 0;
    }

    rememberPlayer(playerId, playerName);

    const existing = bj.bets.find(
        bet => bet.playerId === playerId
    );

    if (existing) {
        const reserved = replaceReservedBet(
            existing,
            amount,
            playerId,
            playerName,
            "blackjack"
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        existing.playerName = playerName;
        existing.amount = amount;
        existing.confirmed = true;
        existing.updatedAt = Date.now();
    } else {
        const reserved = debitChips(
            playerId,
            amount,
            {
                playerName,
                type: "bet",
                gameType: "blackjack",
                note: "Blackjack bet placed"
            }
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        bj.bets.push({
            playerId,
            playerName,
            amount,
            confirmed: true,
            createdAt: Date.now()
        });
    }

    scheduleBlackjackAutoStart();

    res.json({
        ok: true,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/blackjack/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.blackjack.status === "playing") return res.status(409).json({ ok: false, error: "Round already running" });

    state.blackjack.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/blackjack/start", (req, res) => {
    if (!requireAdmin(req, res)) return;

    if (blackjackAutoTimer) {
        clearTimeout(blackjackAutoTimer);
        blackjackAutoTimer = null;
    }

    state.blackjack.autoStartAt = null;

    const result = startBlackjackRound();

    if (!result.ok) {
        return res.status(400).json(result);
    }

    res.json({
        ok: true,
        state: publicState()
    });
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

    if (state.blackjack.status === "playing") {
        return res.status(409).json({
            ok: false,
            error: "Cannot reset a running blackjack round"
        });
    }

    if (blackjackAutoTimer) {
        clearTimeout(blackjackAutoTimer);
        blackjackAutoTimer = null;
    }

    state.blackjack.autoStartAt = null;

    refundBets(
        state.blackjack.bets,
        "blackjack",
        "Blackjack bets cleared by banker"
    );

    state.blackjack.bets = [];
    state.blackjack.players = [];
    state.blackjack.dealerHand = [];
    state.blackjack.deck = [];
    state.blackjack.status = "waiting";
    state.blackjack.currentTurnIndex = 0;

    res.json({
        ok: true,
        state: publicState()
    });
});

// Horse racing routes
app.post("/racing/place-bet", (req, res) => {
    const race = state.racing;

    if (race.racing) {
        return res.status(409).json({
            ok: false,
            error: "Race already running"
        });
    }

    const playerId = cleanPlayerId(
        req.body?.playerId
    );

    const playerName = cleanPlayerName(
        req.body?.playerName
    );

    const amount = cleanAmount(
        req.body?.amount
    );

    const horseId = String(
        req.body?.horseId || ""
    );

    const horse = race.horses.find(
        item => item.id === horseId
    );

    if (!playerId || !playerName || !amount) {
        return res.status(400).json({
            ok: false,
            error: "Invalid race bet"
        });
    }

    if (!horse) {
        return res.status(400).json({
            ok: false,
            error: "Choose a horse"
        });
    }

    rememberPlayer(playerId, playerName);

    const existing = race.bets.find(
        bet => bet.playerId === playerId
    );

    if (existing) {
        const reserved = replaceReservedBet(
            existing,
            amount,
            playerId,
            playerName,
            "racing"
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        existing.playerName = playerName;
        existing.amount = amount;
        existing.horseId = horse.id;
        existing.horseName = horse.name;
        existing.confirmed = true;
        existing.updatedAt = Date.now();
    } else {
        const reserved = debitChips(
            playerId,
            amount,
            {
                playerName,
                type: "bet",
                gameType: "racing",
                note: `Horse racing bet on ${horse.name}`
            }
        );

        if (!reserved.ok) {
            return res.status(400).json({
                ok: false,
                error: reserved.error
            });
        }

        race.bets.push({
            playerId,
            playerName,
            amount,
            horseId: horse.id,
            horseName: horse.name,
            confirmed: true,
            createdAt: Date.now()
        });
    }

    scheduleRacingAutoStart();

    res.json({
        ok: true,
        balance: getChipBalance(playerId),
        state: publicState()
    });
});

app.post("/racing/confirm-all", (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (state.racing.racing) return res.status(409).json({ ok: false, error: "Race already running" });

    state.racing.bets.forEach(b => b.confirmed = true);
    res.json({ ok: true, state: publicState() });
});

app.post("/racing/clear", (req, res) => {
    if (!requireAdmin(req, res)) return;

    if (state.racing.racing) {
        return res.status(409).json({
            ok: false,
            error: "Race already running"
        });
    }

    if (racingAutoTimer) {
        clearTimeout(racingAutoTimer);
        racingAutoTimer = null;
    }

    state.racing.autoStartAt = null;

    refundBets(
        state.racing.bets,
        "racing",
        "Race bets cleared by banker"
    );

    state.racing.bets = [];

    res.json({
        ok: true,
        state: publicState()
    });
});

app.post("/racing/start", (req, res) => {
    if (!requireAdmin(req, res)) return;

    if (racingAutoTimer) {
        clearTimeout(racingAutoTimer);
        racingAutoTimer = null;
    }

    state.racing.autoStartAt = null;

    const result = startHorseRace();

    if (!result.ok) {
        return res.status(400).json(result);
    }

    res.json({
        ok: true,
        race: result.race,
        state: publicState()
    });
});

function shutdownServer(signal) {
    console.log(
        `${signal} received. Saving chip data...`
    );

    if (chipSaveTimer) {
        clearTimeout(chipSaveTimer);
        chipSaveTimer = null;
    }

    saveChipDataImmediately();
    process.exit(0);
}

process.on("SIGTERM", () => {
    shutdownServer("SIGTERM");
});

process.on("SIGINT", () => {
    shutdownServer("SIGINT");
});

loadChipData();

app.listen(PORT, () => {
    console.log(`TT Shared Casino server running on port ${PORT}`);
    console.log(`Banker PIN: ${ADMIN_PIN}`);
    console.log(`Automatic games start after ${AUTO_START_DELAY_MS / 1000} seconds`);
});
