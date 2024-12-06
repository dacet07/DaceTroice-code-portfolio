const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const infoButton = document.getElementById("infoButton");
const stateDisplay = document.getElementById("stateDisplay");

stateDisplay.style.display = "none";

const isMobile = window.innerWidth <= 768;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const swipeThreshold = 50;

let gridSize = 20;

let snake = [[0, 0]];
let moveDirection = [0, 1];
let gameState = "start";
let food, bonusFood, obstacle, score;

const startText = isMobile
  ? `Control the snake's movement with swipe gestures on the grid`
  : `Control the snake's movement using the arrow keys (↑, ↓, ←, →)`;

// Function to set the canvas size based on device type
function setCanvasSize() {
  canvas.width = isMobile ? 300 : 500;
  canvas.height = isMobile ? 300 : 500;
  context.font = isMobile ? "15px serif" : "20px serif";
  gridSize = isMobile ? 15 : 20;

  return canvas.width;
}

const canvasSize = setCanvasSize();
const gridTileSize = canvasSize / gridSize;

function setStartVariables() {
  bonusFood = [];
  obstacle = [];
  score = 0;
  generateFood();
  snake = [
    [0, 1],
    [0, 0],
  ];
  moveDirection = [0, 1];
  gameState = "playing";
  updateButtons();
}

function updateDisplay() {
  if (gameState === "start") {
    stateDisplay.innerHTML = `${startText} to eat food 🍎 and bonus food 🍒, making the snake grow longer. The game ends if the snake hits a wall, collides with itself, or crashes into an obstacle 🧱.<br><br>Ready to start?`;
  } else if (score === 0 && gameState === "playing") {
    stateDisplay.textContent = `The game has started!`;
    stateDisplay.style.display = "block";
    infoButton.style.display = "none";
  } else if (gameState === "end") {
    stateDisplay.textContent = `Game over! Your score: ${score}`;
  } else {
    stateDisplay.textContent = `Score: ${score}`;
  }
}

function showRules() {
  stateDisplay.style.display = "block";
  infoButton.style.display = "none";
}

function updateButtons() {
  if (gameState === "start" || gameState === "end") {
    pauseButton.style.display = "none";
    startButton.style.display = "block";
  } else {
    pauseButton.style.display = "block";
    startButton.style.display = "none";
  }

  switch (gameState) {
    case "start":
      startButton.innerText = "Start";
      break;
    case "playing":
      pauseButton.innerText = "Pause";
      break;
    case "paused":
      pauseButton.innerText = "Play";
      break;
    case "end":
      startButton.innerText = "Play again";
      break;
    default:
      startButton.innerText = "Start";
  }
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  //draw grid
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      (row + col) % 2 === 0
        ? (context.fillStyle = "lightgreen")
        : (context.fillStyle = "#aaf4aa");
      context.fillRect(
        row * gridTileSize,
        col * gridTileSize,
        gridTileSize,
        gridTileSize
      );
    }
  }
  //draw fruit

  const emojiWidth = context.measureText("🍎").width;
  const x = food[0] * gridTileSize + (gridTileSize - emojiWidth) / 2;
  const y = food[1] * gridTileSize + (gridTileSize + 15) / 2;
  context.fillText("🍎", x, y);

  //draw bonus fruit

  const bonusFoodX =
    bonusFood[0] * gridTileSize + (gridTileSize - emojiWidth) / 2;
  const bonusFoodY = bonusFood[1] * gridTileSize + (gridTileSize + 15) / 2;
  context.fillText("🍒", bonusFoodX, bonusFoodY);

  //draw obstacle

  const obstacleX =
    obstacle[0] * gridTileSize + (gridTileSize - emojiWidth) / 2;
  const obstacleY = obstacle[1] * gridTileSize + (gridTileSize + 15) / 2;
  context.fillText("🧱", obstacleX, obstacleY);

  //draw snake
  for (let i = 1; i < snake.length - 1; i++) {
    context.fillStyle = "green";
    context.fillRect(
      snake[i][0] * gridTileSize,
      snake[i][1] * gridTileSize,
      gridTileSize,
      gridTileSize
    );
  }
  //draw snake's tail
  function drawSnakesTail() {
    const tailX = snake[snake.length - 1][0];
    const tailY = snake[snake.length - 1][1];

    const tailsTriangleVertex = { first: [], second: [], third: [] };
    let x, y;

    if (tailX > snake[snake.length - 2][0]) {
      //left
      x = tailX * gridTileSize + gridTileSize;
      y = tailY * gridTileSize + gridTileSize / 2;
      tailsTriangleVertex.first.push(x, y);
      x = tailX * gridTileSize;
      y = tailY * gridTileSize;
      tailsTriangleVertex.second.push(x, y);
      x = tailX * gridTileSize;
      y = tailY * gridTileSize + gridTileSize;
      tailsTriangleVertex.third.push(x, y);
    } else if (tailX < snake[snake.length - 2][0]) {
      //right
      x = tailX * gridTileSize;
      y = tailY * gridTileSize + gridTileSize / 2;
      tailsTriangleVertex.first.push(x, y);
      x = tailX * gridTileSize + gridTileSize;
      y = tailY * gridTileSize + gridTileSize;
      tailsTriangleVertex.second.push(x, y);
      x = tailX * gridTileSize + gridTileSize;
      y = tailY * gridTileSize;
      tailsTriangleVertex.third.push(x, y);
    } else if (tailY < snake[snake.length - 2][1]) {
      //down
      x = tailX * gridTileSize + gridTileSize / 2;
      y = tailY * gridTileSize;
      tailsTriangleVertex.first.push(x, y);
      x = tailX * gridTileSize;
      y = tailY * gridTileSize + gridTileSize;
      tailsTriangleVertex.second.push(x, y);
      x = tailX * gridTileSize + gridTileSize;
      y = tailY * gridTileSize + gridTileSize;
      tailsTriangleVertex.third.push(x, y);
    } else {
      //up
      x = tailX * gridTileSize + gridTileSize / 2;
      y = tailY * gridTileSize + gridTileSize;
      tailsTriangleVertex.first.push(x, y);
      x = tailX * gridTileSize + gridTileSize;
      y = tailY * gridTileSize;
      tailsTriangleVertex.second.push(x, y);
      x = tailX * gridTileSize;
      y = tailY * gridTileSize;
      tailsTriangleVertex.third.push(x, y);
    }
    context.beginPath();
    context.moveTo(tailsTriangleVertex.first[0], tailsTriangleVertex.first[1]);
    context.lineTo(
      tailsTriangleVertex.second[0],
      tailsTriangleVertex.second[1]
    );
    context.lineTo(tailsTriangleVertex.third[0], tailsTriangleVertex.third[1]);
    context.closePath();

    context.fillStyle = "green";
    context.fill();
  }

  drawSnakesTail();

  //draw snake's head
  function drawSnakesHead(x, y, size, radius, direction) {
    rotation = 0;
    if (direction[0] === 1) {
      rotation = 90;
    } else if (direction[0] === -1) {
      rotation = 270;
    } else if (direction[1] === 1) {
      rotation = 180;
    } else {
      rotation = 0;
    }
    context.save();
    // Move the origin to the center of the square for proper rotation
    context.translate(x + size / 2, y + size / 2);

    context.rotate((rotation * Math.PI) / 180);

    context.translate(-size / 2, -size / 2);

    context.beginPath();
    context.moveTo(radius, 0);
    context.arcTo(size, 0, size, size, radius);
    context.lineTo(size, size);
    context.lineTo(0, size);
    context.arcTo(0, 0, radius, 0, radius);

    // Close the path and fill it
    context.closePath();
    context.fillStyle = "#006100"; // Tomato color (you can change this)
    context.fill();

    // Restore the canvas state (undo the translation and rotation)
    context.restore();
  }

  drawSnakesHead(
    snake[0][0] * gridTileSize,
    snake[0][1] * gridTileSize,
    gridTileSize,
    10,
    moveDirection
  );

  context.beginPath();
  context.arc(
    snake[0][0] * gridTileSize + gridTileSize / 2 + 3,
    snake[0][1] * gridTileSize + gridTileSize / 2,
    5,
    0,
    2 * Math.PI
  ); // white
  context.arc(
    snake[0][0] * gridTileSize + gridTileSize / 2 - 3,
    snake[0][1] * gridTileSize + gridTileSize / 2,
    5,
    0,
    2 * Math.PI
  );
  context.fillStyle = "white";
  context.stroke();
  context.fill();

  context.beginPath();
  context.arc(
    snake[0][0] * gridTileSize + gridTileSize / 2 + 3,
    snake[0][1] * gridTileSize + gridTileSize / 2,
    2,
    0,
    2 * Math.PI
  ); //black
  context.arc(
    snake[0][0] * gridTileSize + gridTileSize / 2 - 3,
    snake[0][1] * gridTileSize + gridTileSize / 2,
    2,
    0,
    2 * Math.PI
  );
  context.fillStyle = "black";
  context.fill();
}

function updateSnake(direction) {
  const newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]];
  if (food[0] === newHead[0] && food[1] === newHead[1]) {
    score++;
    food = [];
    setTimeout(generateFood, 700);
  } else if (
    snake.length > 1 &&
    snake.some(
      ([snakeX, snakeY]) => snakeX === newHead[0] && snakeY === newHead[1]
    ) //bite own tail
  ) {
    gameState = "end";
  } else if (bonusFood[0] === newHead[0] && bonusFood[1] === newHead[1]) {
    score += 5;
    bonusFood = [];
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function checkCollision() {
  const head = snake[0];
  if (
    head[0] < 0 ||
    head[0] >= canvas.width / gridTileSize ||
    head[1] < 0 ||
    head[1] >= canvas.height / gridTileSize ||
    (head[0] === obstacle[0] && head[1] === obstacle[1])
  ) {
    gameState = "end"; // Collision with the wall
  }
}

function generateFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
  } while (snake.some(([snakeX, snakeY]) => snakeX === x && snakeY === y)); //generate new coordinate if this is in the same place as the snake.

  food = [x, y];
  if (score > 2) {
    generateBonusFood();
  }
  if (score > 3 && obstacle.length === 0) {
    generateObstacle();
  }
}

function generateBonusFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
  } while (
    snake.some(([snakeX, snakeY]) => snakeX === x && snakeY === y) ||
    (food[0] === x && food[1] === y) ||
    (obstacle[0] === x && obstacle[1] === y)
  ); //generate new coordinate if this is in the same place as the snake or fruit.

  bonusFood = [x, y];

  function deleteBonusFood() {
    bonusFood = [];
  }

  setTimeout(deleteBonusFood, 12000);
}

function generateObstacle() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
  } while (
    snake.some(([snakeX, snakeY]) => snakeX === x && snakeY === y) ||
    (food[0] === x && food[1] === y) ||
    (bonusFood[0] === x && bonusFood[1] === y)
  ); //generate new coordinate if this is in the same place as the snake or fruit.

  obstacle = [x, y];
}

function handleKeyPress(event) {
  // Prevent opposite direction movement
  if (event.key === "ArrowUp" && moveDirection[1] === 0) {
    moveDirection = [0, -1]; // Up
  } else if (event.key === "ArrowDown" && moveDirection[1] === 0) {
    moveDirection = [0, 1]; // Down
  } else if (event.key === "ArrowLeft" && moveDirection[0] === 0) {
    moveDirection = [-1, 0]; // Left
  } else if (event.key === "ArrowRight" && moveDirection[0] === 0) {
    moveDirection = [1, 0]; // Right
  }
}

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Detect horizontal swipe (left or right)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
    if (diffX > 0) {
      moveDirection = [1, 0];
    } else {
      moveDirection = [-1, 0];
    }
  }

  // Detect vertical swipe (up or down)
  if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > swipeThreshold) {
    if (diffY > 0) {
      moveDirection = [0, 1];
    } else {
      moveDirection = [0, -1];
    }
  }
}

function gameLoop() {
  if (gameState === "paused") return;
  let intervalDuration;
  if (score > 10) {
    intervalDuration = 150;
  } else if (score > 5) {
    intervalDuration = 200;
  } else if (score > 1) {
    intervalDuration = 300;
  } else {
    intervalDuration = 350;
  }

  updateSnake(moveDirection);
  checkCollision();
  updateDisplay();

  if (gameState === "end") {
    updateDisplay();
    updateButtons();
    return;
  }

  drawCanvas();

  setTimeout(gameLoop, intervalDuration);
}

function startGame() {
  setStartVariables();
  gameLoop();
}

function togglePause() {
  gameState = gameState === "playing" ? "paused" : "playing";
  updateButtons();
  console.log(gameState);

  if (gameState === "playing") {
    gameLoop();
  }
}

document.addEventListener("keydown", handleKeyPress);

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // Prevent scrolling
  },
  { passive: false }
);

setCanvasSize();
context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
context.fillStyle = "lightgreen";
context.fillRect(0, 0, canvas.width, canvas.height);
updateDisplay();
updateButtons();
