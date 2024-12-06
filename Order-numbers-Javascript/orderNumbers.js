const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const PADDING = 10;
const tileSize = (canvasWidth - PADDING * 2) / 3;

const previewButton = document.getElementById("previewButton");
const startButton = document.getElementById("startButton");

let tilesForShuffle,
  lastMoved,
  isWin,
  numbers,
  emptyTile,
  moveCount,
  hoverTile,
  orderOfShuffle;

let isGameStarted = false;

function startVariables() {
  context.font = "30px Arial";
  canvas.style.backgroundColor = "#7bd42d";
  stateDisplay.style.color = "#d3ffce";

  tilesForShuffle = [6, 8];
  lastMoved = 0;
  isWin = false;

  numbers = {
    1: { x: 0, y: 0, canMove: false },
    2: { x: 1, y: 0, canMove: false },
    3: { x: 2, y: 0, canMove: false },
    4: { x: 0, y: 1, canMove: false },
    5: { x: 1, y: 1, canMove: false },
    6: { x: 2, y: 1, canMove: true },
    7: { x: 0, y: 2, canMove: false },
    8: { x: 1, y: 2, canMove: true },
  };

  emptyTile = { x: 2, y: 2 };
  moveCount = 0;
  hoverTile = null;
  orderOfShuffle = [];
}

function drawTiles(win) {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 1; i < 9; i++) {
    const tile = numbers[i];
    const tileX = tile.x * tileSize + PADDING;
    const tileY = tile.y * tileSize + PADDING;

    // choose the color of the tile
    if (win) {
      canvas.style.backgroundColor = "#3b4f5f";
      context.fillStyle = "rgb(23 142 4 / 100%)";

      //color if win
    } else if (
      hoverTile &&
      hoverTile.x === tile.x &&
      hoverTile.y === tile.y &&
      tile.canMove
    ) {
      context.fillStyle = "rgb(0 60 60 / 100%)"; //  color on hover
    } else {
      context.fillStyle = "rgb(0 40 40 / 100%)"; // default color
    }

    context.fillRect(tileX, tileY, tileSize - 1, tileSize - 1); // Drawing tile
    if (win) {
      context.fillStyle = "rgb(185 223 19 / 30%)";
    } else {
      context.fillStyle = "rgb(60 70 70 / 50%)";
    }

    context.fillRect(tileX + 3, tileY + 3, tileSize - 12, tileSize - 12); // Drawing emboss
    context.fillStyle = "white"; //color of numbers
    context.fillText(
      i,
      numbers[i].x * tileSize + tileSize / 2 - 3,
      numbers[i].y * tileSize + tileSize / 2 + 16
    );
  }
}

function updateDisplay() {
  const stateDisplay = document.getElementById("stateDisplay");
  if (isGameStarted) {
    if (moveCount === 0) {
      stateDisplay.textContent = `The game has started!`;
    } else {
      stateDisplay.textContent = `Move count: ${moveCount}`;
    }

    if (isWin) {
      stateDisplay.style.color = "orange";
      stateDisplay.textContent = `You win with ${moveCount} moves!`;
    }
  } else {
    stateDisplay.innerHTML = `Once the game starts, the tiles will be shuffled. <br> Your task is to rearrange them back into the correct order.`;
  }
}

function updateStartButton() {
  const button = document.getElementById("startButton");
  if (isWin) {
    button.innerText = "Play again";
  } else {
    button.innerText = "Start again";
  }
  if (isGameStarted) {
    button.innerText = "Start again";
  }
}

function ableForMovement() {
  for (let i = 1; i < 9; i++) {
    if (
      Math.abs(emptyTile.x - numbers[i].x) +
        Math.abs(emptyTile.y - numbers[i].y) ===
      1
    ) {
      numbers[i].canMove = true;
      tilesForShuffle.push(i);
    } else {
      numbers[i].canMove = false;
    }
  }
}

function Move(num) {
  if (!isWin) {
    const temp = { x: numbers[num].x, y: numbers[num].y };
    numbers[num].x = emptyTile.x;
    numbers[num].y = emptyTile.y;
    emptyTile.x = temp.x;
    emptyTile.y = temp.y;
    lastMoved = num;
    moveCount++;
  }
}

function checkWinState() {
  const orderedNumbers = {
    1: { x: 0, y: 0 },
    2: { x: 1, y: 0 },
    3: { x: 2, y: 0 },
    4: { x: 0, y: 1 },
    5: { x: 1, y: 1 },
    6: { x: 2, y: 1 },
    7: { x: 0, y: 2 },
    8: { x: 1, y: 2 },
  };

  isWin = true;

  for (const key in orderedNumbers) {
    if (
      orderedNumbers[key].x !== numbers[key].x ||
      orderedNumbers[key].y !== numbers[key].y
    ) {
      isWin = false;
      break;
    }
  }
}

function getTileFromMouse(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left - PADDING;
  const mouseY = event.clientY - rect.top - PADDING;

  const tileX = Math.floor(mouseX / tileSize);
  const tileY = Math.floor(mouseY / tileSize);

  return { tileX, tileY };
}

function startGame() {
  isGameStarted = true;
  startVariables();
  Shuffle();
  ableForMovement();
  drawTiles();
  updateDisplay();
  updateStartButton();
}

function previewGame() {
  startGame();
  previewButton.disabled = true;
  startButton.disabled = true;
  stateDisplay.textContent = `Previewing game`;

  let i = 0;

  const intervalId = setInterval(() => {
    if (i < 10) {
      Move(orderOfShuffle.pop());
      if (i === 9) {
        checkWinState();
        console.log(isWin);
      }
      drawTiles(isWin);
      i++;
    } else {
      clearInterval(intervalId);
      previewButton.disabled = false;
      startButton.disabled = false;
      stateDisplay.textContent = `Preview complete! Ready to start the game?`;
    }
  }, 700);
}

function Shuffle() {
  for (let i = 0; i < 10; i++) {
    ableForMovement();
    tilesForShuffle = tilesForShuffle.filter((item) => item !== lastMoved);

    let randomIndex = Math.floor(Math.random() * tilesForShuffle.length);
    let randomTile = tilesForShuffle[randomIndex];
    orderOfShuffle.push(randomTile);

    Move(randomTile);
    tilesForShuffle = [];
  }
  moveCount = 0;
  console.log(orderOfShuffle);
}

canvas.addEventListener("mousemove", (event) => {
  const { tileX, tileY } = getTileFromMouse(event);

  // Find if mouse is over any numbered tile
  let isHovering = false;
  for (let i = 1; i < 9; i++) {
    if (numbers[i].x === tileX && numbers[i].y === tileY) {
      hoverTile = { x: tileX, y: tileY };
      isHovering = true;
      break;
    }
  }

  if (!isHovering) {
    hoverTile = null;
  }

  drawTiles(isWin);
});

canvas.addEventListener("mouseleave", () => {
  hoverTile = null;

  drawTiles(isWin);
});

canvas.addEventListener("click", (event) => {
  const { tileX, tileY } = getTileFromMouse(event);

  for (let i = 1; i < 9; i++) {
    if (
      numbers[i].x === tileX &&
      numbers[i].y === tileY &&
      numbers[i].canMove
    ) {
      Move(i);
      checkWinState();
      updateDisplay();
      ableForMovement();
      drawTiles(isWin);
      updateStartButton();
    }
  }
});

startVariables();
drawTiles(isWin);
updateDisplay();
