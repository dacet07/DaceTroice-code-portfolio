import * as fs from "fs";

type Grid = string[][];
type Point = [number, number];

let filename = "src\\pacmangrid1.txt";
const TIMEforONElive = 300;

let dotCount = dotCountInGrid(filename);
let pelletCount = pelletCountInGrid(filename);
const allScores: number[] = [];
let level = 1;
let isGamePaused: boolean = false;
let score = 0;
let maxScore: number = 0;
let lifeCount: number = 3;
let pacmanPosition: Point = [1, 1];

const ghostPositions: { [name: string]: Point } = {
  ghostOne: [6, 7],
  ghostTwo: [7, 6],
  ghostThree: [7, 8],
  ghostFour: [7, 7],
};
let grid: Grid = createGrid(filename);
let direction: "up" | "down" | "right" | "left" = "right";
let gridSymbolBeforeGhostOne: string = " ";
let gridSymbolBeforeGhostTwo: string = " ";
let gridSymbolBeforeGhostThree: string = " ";
let gridSymbolBeforeGhostFour: string = " ";
let ghostdirection: "up" | "down" | "right" | "left" = "up";
let eatenDotCount: number = 0;
let eatenPelletCount: number = 0;
let gameState: "start" | "playing" | "gameover" | "win" = "start";
let ghostSymbol: "g" | "G" = "G";
let pacmanGhostCollision: boolean = false;
let ghostOneLive = true;
let ghostTwoLive = true;
let ghostThreeLive = true;
let ghostFourLive = true;

let countdown = TIMEforONElive; // Initial countdown time

function displayMenu() {
  if (gameState === "gameover") console.log("Game over!\n");
  if (gameState === "win") console.log("You win!\n");
  if (gameState === "gameover" || gameState === "win") {
    console.log(`Your all scores: ${allScores}`);
    maxScore = Math.max(...allScores);
    console.log(`The best result: ${maxScore}\n`);
  }
  console.log("======= Pacman =======");
  console.log("Start Game - press s kay");
  console.log("How to Play - press i kay");
  console.log("Quit - press Esc key");
  console.log("=======================");
}

function setStartGameVariables() {
  filename =
    level === 1
      ? "src\\pacmangrid1.txt"
      : level === 2
      ? "src\\pacmangrid2.txt"
      : "src\\pacmangrid3.txt";
  dotCount = dotCountInGrid(filename);
  pelletCount = pelletCountInGrid(filename);
  isGamePaused = false;
  score = 0;
  lifeCount = 3;
  pacmanPosition = [1, 1];
  ghostPositions.ghostOne = [6, 7];
  ghostPositions.ghostTwo = [7, 6];
  ghostPositions.ghostThree = [7, 8];
  ghostPositions.ghostFour = [7, 7];
  grid = createGrid(filename);
  direction = "right";
  gridSymbolBeforeGhostOne = " ";
  gridSymbolBeforeGhostTwo = " ";
  gridSymbolBeforeGhostThree = " ";
  gridSymbolBeforeGhostFour = " ";
  ghostdirection = "up";
  eatenDotCount = 0;
  eatenPelletCount = 0;
  gameState = "start";
  ghostSymbol = "G";
  pacmanGhostCollision = false;
  ghostOneLive = true;
  ghostTwoLive = true;
  ghostThreeLive = true;
  ghostFourLive = true;

  countdown = TIMEforONElive;
}

function howToPlay() {
  fs.readFile("src\\pacmanrules.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the rules file:", err);
    } else {
      console.log(data);
    }
    displayMenu();
  });
}

function createGrid(filename: string): Grid {
  const fileContent = fs.readFileSync(filename, "utf8");
  const lines = fileContent.split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const newGrid: Grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill("."));

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      newGrid[i][j] = lines[i][j];
      if (lines[i][j] === "P") {
        pacmanPosition = [i, j];
      }
    }
  }
  newGrid[pacmanPosition[0]][pacmanPosition[1]] = "P";
  return newGrid;
}

function printGrid(grid: Grid) {
  process.stdout.write("\x1Bc"); //clear screen
  console.log(
    `score ${score} | Time: ${countdown} | Lives: ${lifeCount} | Level: ${level} | Eaten dot ${eatenDotCount} pellet ${eatenPelletCount}`
  ); //display score time etc.
  //console.log(`Test:dots ${dotCount} pellet ${pelletCount}\n`);
  for (let row of grid) {
    console.log(row.join(" "));
  }
  if (isGamePaused) console.log("Game paused.");
}

function dotCountInGrid(filename: string): number {
  const fileContent = fs.readFileSync(filename, "utf8");
  const dotCount = (fileContent.match(/\./g) || []).length;
  return dotCount;
}

function pelletCountInGrid(filename: string): number {
  const fileContent = fs.readFileSync(filename, "utf8");
  const pelletCount = (fileContent.match(/\*/g) || []).length;
  return pelletCount;
}

function getRandomDirection(): "up" | "down" | "left" | "right" {
  const random = Math.random();

  if (random < 0.25) {
    return "up";
  } else if (random < 0.5) {
    return "down";
  } else if (random < 0.75) {
    return "left";
  } else {
    return "right";
  }
}

function moveGhost(ghostName: string, ghostdirection: string) {
  const position = ghostPositions[ghostName];
  if (position) {
    let changeDirection = false;
    // write in grid symbol before ghost
    switch (ghostName) {
      case "ghostOne":
        grid[position[0]][position[1]] = gridSymbolBeforeGhostOne;
        break;
      case "ghostTwo":
        grid[position[0]][position[1]] = gridSymbolBeforeGhostTwo;
        break;
      case "ghostThree":
        grid[position[0]][position[1]] = gridSymbolBeforeGhostThree;
        break;
      case "ghostFour":
        grid[position[0]][position[1]] = gridSymbolBeforeGhostFour;
    }

    switch (ghostdirection) {
      case "up":
        if (
          position[0] > 0 &&
          !(
            grid[position[0] - 1][position[1]] === "|" ||
            grid[position[0] - 1][position[1]] === "-" ||
            grid[position[0] - 1][position[1]] === "G" ||
            grid[position[0] - 1][position[1]] === "g"
          )
        ) {
          position[0] -= 1;
        } else {
          changeDirection = true;
        }
        break;
      case "down":
        if (
          position[0] < grid.length - 1 &&
          !(
            grid[position[0] + 1][position[1]] === "|" ||
            grid[position[0] + 1][position[1]] === "-" ||
            grid[position[0] + 1][position[1]] === "G" ||
            grid[position[0] + 1][position[1]] === "g"
          )
        ) {
          position[0] += 1;
        } else {
          changeDirection = true;
        }
        break;
      case "right":
        if (
          position[1] < grid[0].length - 1 &&
          !(
            grid[position[0]][position[1] + 1] === "|" ||
            grid[position[0]][position[1] + 1] === "-" ||
            grid[position[0]][position[1] + 1] === "G" ||
            grid[position[0]][position[1] + 1] === "g"
          )
        ) {
          position[1] += 1;
        } else {
          changeDirection = true;
        }
        break;
      case "left":
        if (
          position[1] > 0 &&
          !(
            grid[position[0]][position[1] - 1] === "|" ||
            grid[position[0]][position[1] - 1] === "-" ||
            grid[position[0]][position[1] - 1] === "G" ||
            grid[position[0]][position[1] - 1] === "g"
          )
        ) {
          position[1] -= 1;
        } else {
          changeDirection = true;
        }
        break;
    }

    if (grid[position[0]][position[1]] === "P") {
      if (ghostSymbol === "G") {
        pacmanGhostCollision = true;
        console.log("collision");
      } else {
        score += 200;
        switch (ghostName) {
          case "ghostOne":
            ghostOneLive = false;
            break;
          case "ghostTwo":
            ghostTwoLive = false;
            break;
          case "ghostThree":
            ghostThreeLive = false;
            break;
          case "ghostFour":
            ghostFourLive = false;
        }
      }
    } else {
      switch (ghostName) {
        case "ghostOne":
          gridSymbolBeforeGhostOne = grid[position[0]][position[1]];
          break;
        case "ghostTwo":
          gridSymbolBeforeGhostTwo = grid[position[0]][position[1]];
          break;
        case "ghostThree":
          gridSymbolBeforeGhostThree = grid[position[0]][position[1]];
          break;
        case "ghostFour":
          gridSymbolBeforeGhostFour = grid[position[0]][position[1]];
      }

      grid[position[0]][position[1]] = ghostSymbol;

      if (changeDirection) {
        ghostdirection = getRandomDirection();
        moveGhost(ghostName, ghostdirection);
      }
    }
  }
  return ghostdirection;
}

function movePacman(direction: "up" | "down" | "right" | "left") {
  grid[pacmanPosition[0]][pacmanPosition[1]] = " ";
  switch (direction) {
    case "up":
      if (
        pacmanPosition[0] > 0 &&
        (grid[pacmanPosition[0] - 1][pacmanPosition[1]] === "." ||
          grid[pacmanPosition[0] - 1][pacmanPosition[1]] === " " ||
          grid[pacmanPosition[0] - 1][pacmanPosition[1]] === "*")
      ) {
        if (grid[pacmanPosition[0] - 1][pacmanPosition[1]] === ".") {
          score += 10;
          eatenDotCount++;
        }
        if (grid[pacmanPosition[0] - 1][pacmanPosition[1]] === "*") {
          score += 50;
          eatenPelletCount++;
          ghostSymbol = "g";
        } //score
        pacmanPosition[0] -= 1;
      }
      break;
    case "down":
      if (
        pacmanPosition[0] < grid.length - 1 &&
        (grid[pacmanPosition[0] + 1][pacmanPosition[1]] === "." ||
          grid[pacmanPosition[0] + 1][pacmanPosition[1]] === " " ||
          grid[pacmanPosition[0] + 1][pacmanPosition[1]] === "*")
      ) {
        if (grid[pacmanPosition[0] + 1][pacmanPosition[1]] === ".") {
          score += 10;
          eatenDotCount++;
        }
        if (grid[pacmanPosition[0] + 1][pacmanPosition[1]] === "*") {
          score += 50;
          eatenPelletCount++;
          ghostSymbol = "g";
        } //score
        pacmanPosition[0] += 1;
      }
      break;
    case "right":
      if (
        pacmanPosition[1] < grid[0].length - 1 &&
        (grid[pacmanPosition[0]][pacmanPosition[1] + 1] === "." ||
          grid[pacmanPosition[0]][pacmanPosition[1] + 1] === " " ||
          grid[pacmanPosition[0]][pacmanPosition[1] + 1] === "*")
      ) {
        if (grid[pacmanPosition[0]][pacmanPosition[1] + 1] === ".") {
          score += 10;
          eatenDotCount++;
        }
        if (grid[pacmanPosition[0]][pacmanPosition[1] + 1] === "*") {
          score += 50;
          eatenPelletCount++;
          ghostSymbol = "g";
        } //score
        pacmanPosition[1] += 1;
      }
      break;
    case "left":
      if (
        pacmanPosition[1] > 0 &&
        (grid[pacmanPosition[0]][pacmanPosition[1] - 1] === "." ||
          grid[pacmanPosition[0]][pacmanPosition[1] - 1] === " " ||
          grid[pacmanPosition[0]][pacmanPosition[1] - 1] === "*")
      ) {
        if (grid[pacmanPosition[0]][pacmanPosition[1] - 1] === ".") {
          score += 10;
          eatenDotCount++;
        }
        if (grid[pacmanPosition[0]][pacmanPosition[1] - 1] === "*") {
          score += 50;
          eatenPelletCount++;
          ghostSymbol = "g";
        } //score
        pacmanPosition[1] -= 1;
      }
      break;
  }
  if (grid[pacmanPosition[0]][pacmanPosition[1]] === "G") {
    pacmanGhostCollision = true;
    console.log("collision");
  } else {
    grid[pacmanPosition[0]][pacmanPosition[1]] = "P";
  }
}

// Define a function to update the screen at regular intervals
function updateScreen() {
  if (gameState === "playing" || gameState === "start") {
    if (!isGamePaused) {
      countdown -= 1;
      if (eatenDotCount === dotCount - 1 && eatenPelletCount === pelletCount) {
        //win
        gameState = "win";
        level++;
        if (level > 3) level = 3;
        allScores.push(score);
        displayMenu();
      }
      if (countdown <= 0 || pacmanGhostCollision) {
        if (lifeCount === 1) {
          gameState = "gameover";
          allScores.push(score);

          displayMenu();
        } else {
          lifeCount--;
          countdown = TIMEforONElive;
          ghostOneLive = true;
          ghostTwoLive = true;
          ghostThreeLive = true;
          ghostFourLive = true;
          pacmanGhostCollision = false;
          eatenDotCount = 0;
          eatenPelletCount = 0;
          pacmanPosition = [1, 1];
          ghostPositions.ghostOne = [6, 7];
          ghostPositions.ghostTwo = [7, 6];
          ghostPositions.ghostThree = [7, 8];
          ghostPositions.ghostFour = [7, 7];
          grid = createGrid(filename);
        }
      }
      if (ghostSymbol === "g") {
        setTimeout(() => {
          ghostSymbol = "G";
        }, 10000);
      }

      printGrid(grid);
      movePacman(direction);
      if (ghostOneLive) {
        moveGhost("ghostOne", ghostdirection);
      }
      if (countdown < 250) {
        if (ghostTwoLive) {
          moveGhost("ghostTwo", ghostdirection);
        }
      } else {
        grid[7][6] = "G";
      }
      if (countdown < 200) {
        if (ghostThreeLive) {
          moveGhost("ghostThree", ghostdirection);
        }
      } else {
        grid[7][8] = "G";
      }
      if (countdown < 150) {
        if (ghostFourLive) {
          moveGhost("ghostFour", ghostdirection);
        }
      } else {
        grid[7][7] = "G";
      }
      setTimeout(updateScreen, 500);
      // Update every  second
    } else {
      //pause
      setTimeout(updateScreen, 500); // If paused, keep checking every 0.5 second
    }
  } else {
    displayMenu();
  }
}

// Function to pause the game
function pauseGame() {
  isGamePaused = true;
}

// Function to resume the game
function resumeGame() {
  isGamePaused = false;
}
if (gameState === "start" || "win" || "gameover") displayMenu();

let keypress = require("keypress");
keypress(process.stdin);
process.stdin.on("keypress", function (ch, key) {
  if (key) {
    switch (key.name) {
      //case "w":
      case "up":
        direction = "up";
        break;
      //case "s":
      case "down":
        direction = "down";
        break;
      //case "d":
      case "right":
        direction = "right";
        break;
      //case "a":
      case "left":
        direction = "left";
        break;
      case "p": // Use the space key to pause and resume
        if (isGamePaused) {
          resumeGame();
        } else {
          pauseGame();
        }
        break;
      case "m":
        displayMenu();
        pauseGame();
        break;
      case "s":
        setStartGameVariables();

        updateScreen();
        console.log(gameState);
        break;
      case "i":
        howToPlay();
        break;
      case "escape":
        process.exit(0); // Exit the program when the Esc key is pressed
    }
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
