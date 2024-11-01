import $ from "jquery";

console.log("Body jQuery node:", $("body"));
console.log("Body javascript node:", document.querySelector("body"));

let canvas = document.getElementById("pongCanvas") as HTMLCanvasElement; //find canvas element
let context = canvas.getContext("2d"); //create drawing object

let result = document.getElementById("result") as HTMLBodyElement;

const canvasWidth = 800;
const canvasHeight = 800;
const squareAmountInLine = 20;
const ballRadius = canvasWidth / squareAmountInLine / 2;
const SPEED = 4;
const squareSize: number = canvasWidth / squareAmountInLine;
let colorOfSquares: string[][] = [];

//start colors of balls
const whiteBallColor = [200, 200, 200];
const blackBallColor = [55, 55, 55];

//start positions of balls
let xWhite = canvasWidth - ballRadius * 2;
let yWhite = Math.floor(Math.random() * canvasHeight);
let xBlack = 0 + ballRadius * 2;
let yBlack = Math.floor(Math.random() * canvasHeight);

//vector and speed of ball movement
let vxWhite = Math.floor(Math.random() * 2 + SPEED);
let vyWhite = Math.floor(Math.random() * 2 + SPEED);
let vxBlack = Math.floor(Math.random() * 2 + SPEED);
let vyBlack = Math.floor(Math.random() * 2 + SPEED);

//count square of current color
function countSquares(color: string): number {
  let count = 0;
  for (let i = 0; i < squareAmountInLine; i++) {
    for (let j = 0; j < squareAmountInLine; j++) {
      if (colorOfSquares[i][j] === color) count++;
    }
  }
  return count;
}

//make new array of squares
function newArrayOfSquares() {
  for (let i = 0; i < squareAmountInLine; i++) {
    colorOfSquares[i] = []; // Initialize inner arrays
    for (let j = 0; j < squareAmountInLine; j++) {
      colorOfSquares[i][j] = j < squareAmountInLine / 2 ? "white" : "black";
    }
  }
}

function drawGrid() {
  let x = 0;
  let y = 0;
  for (let i = 0; i < squareAmountInLine; i++) {
    for (let j = 0; j < squareAmountInLine; j++) {
      context.beginPath();
      y = i * squareSize;
      x = j * squareSize;
      context.rect(x, y, squareSize, squareSize);
      context.fillStyle = colorOfSquares[i][j];
      context.fill();
    }
  }
}

//find current square
function currentSquare(a: number, b: number): [number, number] {
  return [Math.floor(a / squareSize), Math.floor(b / squareSize)];
}

function ballMoving() {
  let hor: number;
  let ver: number;

  context.clearRect(0, 0, canvasWidth, canvasHeight); //clear all
  drawGrid(); // redraw grid

  const whiteSquareCount = countSquares("white").toString();
  const blackSquareCount = countSquares("black").toString();
  result.textContent = `day ${whiteSquareCount} | night ${blackSquareCount}`;

  //when white ball bounce from edge
  [hor, ver] = currentSquare(xWhite, yWhite);
  if (colorOfSquares[ver][hor] === "white") {
    vxWhite = -vxWhite;
    colorOfSquares[ver][hor] = "black";
    whiteBallColor.forEach((value, index, array) => {
      array[index] = value + 3;
      if (array[index] > 255) array[index] = 255;
    });
    blackBallColor.forEach((value, index, array) => {
      array[index] = value + 3;
      if (array[index] > 200) array[index] = 200;
    });
  }
  if (ballRadius + xWhite > canvasWidth || xWhite - ballRadius < 0)
    vxWhite = -vxWhite;
  if (yWhite + ballRadius > canvasHeight || yWhite - ballRadius < 0)
    vyWhite = -vyWhite;

  xWhite += vxWhite;
  yWhite += vyWhite;
  context.beginPath();
  context.arc(xWhite, yWhite, ballRadius, 0, Math.PI * 2);
  context.fillStyle = `rgb(${whiteBallColor[0]}, ${whiteBallColor[1]}, ${whiteBallColor[2]})`;
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.fill();
  context.stroke();

  //when black ball bounce from edge
  [hor, ver] = currentSquare(xBlack, yBlack);
  if (colorOfSquares[ver][hor] === "black") {
    vxBlack = -vxBlack;

    colorOfSquares[ver][hor] = "white";
    blackBallColor.forEach((value, index, array) => {
      array[index] = value - 3;
      if (array[index] < 0) array[index] = 0;
    });
    whiteBallColor.forEach((value, index, array) => {
      array[index] = value - 3;
      if (array[index] < 100) array[index] = 100;
    });
  }
  if (xBlack - ballRadius < 0 || ballRadius + xBlack > canvasWidth)
    vxBlack = -vxBlack;
  if (yBlack + ballRadius > canvasHeight || yBlack - ballRadius < 0)
    vyBlack = -vyBlack;

  xBlack += vxBlack;
  yBlack += vyBlack;

  context.beginPath();
  context.arc(xBlack, yBlack, ballRadius, 0, Math.PI * 2);
  context.fillStyle = `rgb(${blackBallColor[0]}, ${blackBallColor[1]}, ${blackBallColor[2]})`;
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.fill();
  context.stroke();

  requestAnimationFrame(ballMoving);
}

newArrayOfSquares();
ballMoving();
