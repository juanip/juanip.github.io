var player = {
  position: {
    x: 0,
    y: 0
  },
  size: {
    x: 50,
    y: 50
  },
  color: 'blue',
  speed: 10,
  velocity: {
    x: 0,
    y: 0    
  },
  weapon: {
    direction: 'right',
    bullet: {
      size: {
        x: 5,
        y: 155
      },
      velocity: {
        x: 0,
        y: 0
      },
      position: { 
        x: 0,
        y: 0
      },
      color: 'white',
      speed: 10
    }
  },
  score: 0
}

var board = {
  speed: 20,
  size: {
    x: 800,
    y: 600
  },
  offset: { x: 0, y: 20 },
  color: 'black',
  score: {
    background: 'white',
    color: 'black',
    font: '15px verdana',
    record: 1000
  },
  bullets: [],
  targets: []
}

var boardCanvas = document.getElementById('canvas');
var boardContext = boardCanvas.getContext('2d');

boardCanvas.height = board.size.y + board.offset.y;
boardCanvas.width = board.size.x + board.offset.x;

window.setInterval(draw, 1000/30);
window.setInterval(main, board.speed);

window.addEventListener('keydown', changeDirection);

var graphics = new Graphics();
var physics = new Physics();

function draw() {
  graphics.drawBoard(boardContext, board);
  graphics.drawRect(boardContext, player, board);

  board.targets.forEach(function(target) {
    graphics.drawRect(boardContext, target, board);
  });

  board.bullets.forEach(function(bullet) {
    graphics.drawRect(boardContext, bullet, board);
  });

  drawScore();
}

function drawScore() {
  graphics.drawText(boardContext, { 
    color: board.score.color, 
    font: board.score.font, 
    text: 'SCORE: ' + getScore(player), 
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
      x: board.size.x * .8,
      y: board.offset.y * .75 
    }
  });
}

function getScore(player) {
  return player.score * 100;
}

function main() {
  board.targets = board.targets.filter(moveEntity).map(function(target) {
    var hit = isHit(player, target);
    
    if(hit) {
      player.score -= 1;
    }

    return target;
  });

  board.bullets = board.bullets.filter(moveEntity).filter(function(bullet) {
    flag = true;
    board.targets = board.targets.filter(function(t) {
      var hit = !isHit(t, bullet);
      flag &= hit;
      return hit;
    })

    if(!flag) {
      player.score++;
    }

    return flag;
  });

  if(Math.random() > 0.95) {
    board.targets.push({
      position: {
        x: board.size.x - 70,
        y: Math.floor(Math.random() * board.size.y) - 40
      },
      size: {
        x: 70,
        y: 40
      },
      velocity: {
        x: -2,
        y: 0
      },
      speed: 1,
      color: 'red'
    });
  }

}

function isHit(target, bullet) {
  var targetEdges = {
    x: [target.position.x, target.position.x + target.size.x],
    y: [target.position.y, target.position.y + target.size.y]
  }

  var bulletCenter = {
    x: [bullet.position.x, bullet.position.x + bullet.size.x],
    y: [bullet.position.y, bullet.position.y + bullet.size.y]
  }

  var flag1 = bulletCenter.x[0] >= targetEdges.x[0] && bulletCenter.x[0] <= targetEdges.x[1]; 
  var flag2 = bulletCenter.x[1] >= targetEdges.x[0] && bulletCenter.x[1] <= targetEdges.x[1]; 
  var flag3 = bulletCenter.y[0] >= targetEdges.y[0] && bulletCenter.y[0] <= targetEdges.y[1]; 
  var flag4 = bulletCenter.y[1] >= targetEdges.y[0] && bulletCenter.y[1] <= targetEdges.y[1]; 

  var flag5 = targetEdges.x[0] >= bulletCenter.x[0] && targetEdges.x[0] <= bulletCenter.x[1]; 
  var flag6 = targetEdges.x[1] >= bulletCenter.x[0] && targetEdges.x[1] <= bulletCenter.x[1]; 
  var flag7 = targetEdges.y[0] >= bulletCenter.y[0] && targetEdges.y[0] <= bulletCenter.y[1]; 
  var flag8 = targetEdges.y[1] >= bulletCenter.y[0] && targetEdges.y[1] <= bulletCenter.y[1]; 


  return ((flag1 || flag2) && (flag3 || flag4)) || ((flag5 || flag6) && (flag7 || flag8));
}

function moveEntity(entity) {
  var oldPosition = {
    x: entity.position.x,
    y: entity.position.y
  };

  entity.position = physics.nextPosition(entity, board, false);

  return oldPosition.x != entity.position.x || oldPosition.y != entity.position.y;
}

function changeDirection(evt) {
  var direction = undefined;

  switch(evt.keyCode) {
    case 119:
    case 38:
      direction = 'up';
      break;
    case 100:
    case 39:
      break;
    case 115:
    case 40:
      direction = 'down';
      break;
    case 97:
    case 37:
      break;
    case 32: // space bar
      shoot();
      break;
  }

  if(direction !== undefined) {
    var nextVelocity = physics.changeVelocity(player, direction);
  
    player.velocity = nextVelocity;
    player.position = physics.nextPosition(player, board, false);
  }
}

function shoot() {
  direction = player.weapon.direction;
  bullet = JSON.parse(JSON.stringify(player.weapon.bullet));

  var diff = {
    x: player.size.x - bullet.size.x,
    y: player.size.y - bullet.size.y
  };

  bullet.position = {
    x: player.position.x - diff.x / 2,
    y: player.position.y + diff.y / 2
  };
  bullet.velocity = physics.changeVelocity(bullet, direction);
  board.bullets.push(bullet);
}