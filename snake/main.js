var board = {
  size: { x: 400, y: 400 },
  offset: { x: 0, y: 20 },
  boardColor: 'black',
  scoreBackground: 'white',
  scoreText: 'black',
  speed: 200,
  maxScore: 100
};

var player = {
  size: { x: 20, y: 20 },
  velocity: { x: 0, y: 0 },
  color: 'green'
};

player.body = [generateRandomPosition(board, player, [])];

var food = {
  size: { x: 20, y: 20 },
  color: 'yellow'
};

food.position = generateRandomPosition(board, food, player.body);

var boardCanvas = document.getElementById('gameboard');
var boardContext = boardCanvas.getContext('2d');
boardCanvas.height = board.size.y + board.offset.y;
boardCanvas.width = board.size.x + board.offset.x;

window.setInterval(mainSnake, 1000/60);
document.addEventListener('keypress', changeDirection);

var velocity = window.setInterval(inertiaSnake, board.speed);

function mainSnake() {
  boardContext.fillStyle = board.scoreBackground;
  boardContext.fillRect(0, 0, board.size.x, board.offset.y);

  boardContext.fillStyle = board.scoreText;
  boardContext.font = "15px verdana";
  boardContext.fillText("SCORE: " + getScore(player.body.length), board.size.x * .02, board.offset.y * .75);
  boardContext.fillText("RECORD: " + board.maxScore, board.size.x * .7, board.offset.y * .75);

  boardContext.fillStyle = board.boardColor;
  boardContext.clearRect(0 + board.offset.x, 0 + board.offset.y, board.size.x, board.size.y);
  boardContext.fillRect(0 + board.offset.x, 0 + board.offset.y, board.size.x, board.size.y);

  boardContext.fillStyle = player.color;
  player.body.forEach(function(dot) {
    boardContext.fillRect(dot.x + board.offset.x, dot.y + board.offset.y, player.size.x, player.size.y);
    boardContext.stroke();
  });

  boardContext.fillStyle = food.color;
  boardContext.fillRect(food.position.x + board.offset.x, food.position.y + board.offset.y, food.size.x, food.size.y);
}

function inertiaSnake() {
  head = nextHead(player);
  
  if(grow(food, head)) {
    food.position = generateRandomPosition(board, food, player.body);
    setScore(board, player);
    //incrementSpeed(board);
  } else {
    player.body.pop();
  }

  if(lose(player.body, head)) {
    reset();
    return;
  }

  player.body.splice(0, 0, head);
}

function reset() {
  window.clearInterval(velocity);
  
  player.velocity = { x: 0, y: 0 };
  player.body = [generateRandomPosition(board, player, [])];
  food.position = generateRandomPosition(board, food, player.body);
  
  velocity = window.setInterval(inertiaSnake, board.speed);
}

function setScore(board, player) {
  board.maxScore = getScore(player.body.length + 1) > board.maxScore ? getScore(player.body.length + 1) : board.maxScore;
}

function getScore(size) {
  return size * 100;
}

function nextHead(player) {
  head = {x: 0, y: 0};
  head.x = player.body[0].x + player.velocity.x;
  head.y = player.body[0].y + player.velocity.y;
  
  head.y = head.y >= board.size.y ? 0 : head.y;
  head.y = head.y < 0 ? board.size.y - player.size.y : head.y;
  
  head.x = head.x >= board.size.x ? 0 : head.x;
  head.x = head.x < 0 ? board.size.x - player.size.x : head.x;

  return head;
}

function incrementSpeed(board) {
  board.speed -= 10;
  window.clearInterval(velocity);
  velocity = window.setInterval(inertiaSnake, board.speed);
}

function generateRandomPosition(board, entity, avoid) {
  position = { x: 0, y: 0 };

  do {
    position.x = Math.floor(Math.random() * (board.size.x / entity.size.x)) * entity.size.x;
    position.y = Math.floor(Math.random() * (board.size.y / entity.size.y)) * entity.size.y;
  
    flag = false;
  
    for (var i = 0; i < avoid.length; i++) {
      if (avoid[i].x === position.x && avoid[i].y === position.y) {
        flag = true;
        break;
      }
    }
  } while (flag);

  return position;  
}

function grow(food, head) {
  return food.position.y === head.y && food.position.x === head.x;
}

function lose(body, head) {
  if (body.length === 1) return false;

  for (var i = 0; i < body.length; i++) {
    if (body[i].x === head.x && body[i].y === head.y) return true;
  }
  
  return false;
}

function changeDirection(evt) {
  switch(evt.keyCode) {
    case 119:
    case 38:
      player.velocity.y = getVelocity(player.velocity.y, -player.size.y);
      player.velocity.x = 0;
      break;
    case 100:
    case 39:
      player.velocity.x = getVelocity(player.velocity.x, player.size.x);
      player.velocity.y = 0;
      break;
    case 115:
    case 40:
      player.velocity.y = getVelocity(player.velocity.y, player.size.y);
      player.velocity.x = 0;
      break;
    case 97:
    case 37:
      player.velocity.x = getVelocity(player.velocity.x, -player.size.x);
      player.velocity.y = 0;
      break;
  }
}

function getVelocity(currentVelocity, newVelocity) {
  return currentVelocity === 0 ? newVelocity : currentVelocity;
} 
