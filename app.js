const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 600;
let xDirection = -2;
let yDirection = 2;
let timerId;
let score = 0;

const userStart = [230, 10];
let currentPos = userStart;

const ballStart = [270, 40];
let ballCurrentPos = ballStart;

//create the block
class block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//blocks
const blocks = [
  new block(10, 550),
  new block(120, 550),
  new block(230, 550),
  new block(340, 550),
  new block(450, 550),

  new block(10, 520),
  new block(120, 520),
  new block(230, 520),
  new block(340, 520),
  new block(450, 520),

  new block(10, 490),
  new block(120, 490),
  new block(230, 490),
  new block(340, 490),
  new block(450, 490),
];

//Basic func to draw the block
function addblocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addblocks();

//addng user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

//draw the user
function drawUser() {
  user.style.left = currentPos[0] + "px";
  user.style.bottom = currentPos[1] + "px";
}

//draw the ball
function drawBall() {
  ball.style.left = ballCurrentPos[0] + "px";
  ball.style.bottom = ballCurrentPos[1] + "px";
}

//moving user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPos[0] > 0) {
        currentPos[0] -= 10;
        drawUser();
      }
      break;

    case "ArrowRight":
      if (currentPos[0] < 460) {
        currentPos[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

//add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

//move ball
function moveBall() {
  ballCurrentPos[0] += xDirection;
  ballCurrentPos[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 10);

//check for collisions
function checkForCollisions() {
  //check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPos[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPos[0] < blocks[i].bottomRight[0] &&
      ballCurrentPos[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPos[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      //console.log(allBlocks);
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      //check for win
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "You Win";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  //check for wall collisions
  if (
    ballCurrentPos[0] >= boardWidth - ballDiameter ||
    ballCurrentPos[1] >= boardWidth - ballDiameter ||
    ballCurrentPos[0] <= 0
  ) {
    changeDirection();
  }

  //check for user collisions
  if (
    ballCurrentPos[0] > currentPos[0] &&
    ballCurrentPos[0] < currentPos[0] + blockWidth &&
    ballCurrentPos[1] > currentPos[1] &&
    ballCurrentPos[1] < currentPos[1] + blockHeight
  ) {
    changeDirection();
  }

  //check for game over
  if (ballCurrentPos[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
