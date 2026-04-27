const size = 4;

let player, wumpus, gold, pits;
let arrowUsed = false;
let gameOver = false;

// 🎲 RANDOM POSITION GENERATOR
function getRandomCell() {
    return {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size)
    };
}

// 🎲 INITIALIZE GAME
function initGame() {
    gameOver = false;
    arrowUsed = false;

    player = getRandomCell();

    do { wumpus = getRandomCell(); } 
    while (same(player, wumpus));

    do { gold = getRandomCell(); } 
    while (same(player, gold) || same(wumpus, gold));

    pits = [];
    for (let i = 0; i < 2; i++) {
        let pit;
        do {
            pit = getRandomCell();
        } while (
            same(pit, player) ||
            same(pit, wumpus) ||
            same(pit, gold) ||
            pits.some(p => same(p, pit))
        );
        pits.push(pit);
    }

    draw();
}

// 🟰 CHECK SAME CELL
function same(a, b) {
    return a.x === b.x && a.y === b.y;
}

// 🎮 DRAW GRID
function draw() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (x === player.x && y === player.y) {
                cell.classList.add("player");
                cell.innerText = "🧍";
            }

            game.appendChild(cell);
        }
    }

    checkGame();
}

// 🧠 PERCEPTS + LOGIC
function checkGame() {
    if (gameOver) return;

    let info = "";

    if (isNear(player, wumpus)) info += "💀 Stench! ";
    if (pits.some(p => isNear(player, p))) info += "🌪 Breeze! ";
    if (same(player, gold)) {
        info += "💰 You found Gold! YOU WIN!";
        gameOver = true;
    }

    if (same(player, wumpus)) {
        info = "💀 Wumpus ate you!";
        gameOver = true;
    }

    if (pits.some(p => same(player, p))) {
        info = "🕳 Fell into pit!";
        gameOver = true;
    }

    document.getElementById("info").innerText = info;
}

// 📍 MOVE PLAYER
function move(dir) {
    if (gameOver) return;

    if (dir === "up" && player.y > 0) player.y--;
    if (dir === "down" && player.y < size - 1) player.y++;
    if (dir === "left" && player.x > 0) player.x--;
    if (dir === "right" && player.x < size - 1) player.x++;

    draw();
}

// 🏹 SHOOT ARROW
function shoot(dir) {
    if (gameOver || arrowUsed) return;

    arrowUsed = true;

    let hit = false;

    if (dir === "up" && player.x === wumpus.x && player.y > wumpus.y) hit = true;
    if (dir === "down" && player.x === wumpus.x && player.y < wumpus.y) hit = true;
    if (dir === "left" && player.y === wumpus.y && player.x > wumpus.x) hit = true;
    if (dir === "right" && player.y === wumpus.y && player.x < wumpus.x) hit = true;

    if (hit) {
        document.getElementById("info").innerText = "🏹 You killed the Wumpus! YOU WIN!";
        gameOver = true;
    } else {
        document.getElementById("info").innerText = "❌ Missed! No arrows left!";
    }
}

// 🔄 RESET GAME
function resetGame() {
    initGame();
}

// 🔍 CHECK ADJACENT
function isNear(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

// START GAME
initGame();