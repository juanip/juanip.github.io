var board = {
  size: { x: 400, y: 400 },
  offset: { x: 0, y: 20 },
  color: 'black',
  score: {
    background: 'white',
    color: 'black',
    font: '15px verdana',
    record: 1000
  },
  speed: 200
};

var player = {
  size: { x: 20, y: 20 },
  velocity: { x: 0, y: 0 },
  color: 'green',
  speed: 20
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

var graphics = new Graphics();
var physics = new Physics();

window.setInterval(drawGame, 1000/30);
document.addEventListener('keydown', changeDirection);

var velocity = window.setInterval(main, board.speed);

function drawGame() {
  graphics.drawBoard(boardContext, board);
  drawScore();
  drawPlayer();
  drawFood();
}

function drawScore() {
  graphics.drawText(boardContext, { 
    color: board.score.color, 
    font: board.score.font, 
    text: 'SCORE: ' + getScore(player.body.length), 
    position: {
      x: board.size.x * .02,
      y: board.offset.y * .75 
    }
  });

  graphics.drawText(boardContext, { 
    color: board.score.color, 
    font: board.score.font, 
    text: 'RECORD: ' + board.score.record, 
    position: {
      x: board.size.x * .7,
      y: board.offset.y * .75 
    }
  });
}

function drawPlayer() {
  player.body.forEach(function(dot) {
    graphics.drawRect(boardContext, { 
      position: dot,
      color: player.color,
      size: player.size
    }, 
    board);
  });
}

function drawFood() {
  graphics.drawRect(boardContext, food, board);
}

function main() {
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
  
  velocity = window.setInterval(main, board.speed);
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
  var direction;

  switch(evt.keyCode) {
    case 119:
    case 38:
      direction = 'up';
      break;
    case 100:
    case 39:
      direction = 'right';
      break;
    case 115:
    case 40:
      direction = 'down';
      break;
    case 97:
    case 37:
      direction = 'left';
      break;
  }

  player.velocity = physics.changeDirection(player, direction);
}
