const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let gameInterval;
let gameSpeed = 150;
let gameStarted = false;

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const snakeElement = createGameElement("div", "snake");

        // 🟢 Make the head different in color
        if (index === 0) {
            snakeElement.style.backgroundColor = "black"; // Change to dark green if preferred: "#004d00"
        }

        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize) + 1;
        y = Math.floor(Math.random() * gridSize) + 1;
    } while (snake.some(segment => segment.x === x && segment.y === y)); // Avoid spawning food on snake
    return { x, y };
}

function move() {
    const head = { ...snake[0] };

    switch (direction) {
        case "right": head.x++; break;
        case "left": head.x--; break;
        case "up": head.y--; break;
        case "down": head.y++; break;
    }

    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    // 🛑 Wall collision
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        endGame();
        return;
    }

    // 🛑 Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 5;
    }
}

function updateScore() {
    const currentScore = snake.length - 1;
    scoreDisplay.textContent = "Score: " + currentScore.toString().padStart(3, "0");
}

function gameLoop() {
    move();
    checkCollision();
    draw();
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    instructionText.style.display = "none";
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your final score: " + (snake.length - 1));
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeed = 150;
    gameStarted = false;
    instructionText.style.display = "block";
    draw();
}

function handleKeyPress(event) {
    if (!gameStarted && (event.code === "Space" || event.key === " ")) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp": if (direction !== "down") direction = "up"; break;
            case "ArrowDown": if (direction !== "up") direction = "down"; break;
            case "ArrowLeft": if (direction !== "right") direction = "left"; break;
            case "ArrowRight": if (direction !== "left") direction = "right"; break;
        }
    }
}

document.addEventListener("keydown", handleKeyPress);
draw();
