class Physics {
  changeDirection(player, direction) {
    var velocity = { 
      x: player.velocity.x, 
      y: player.velocity.y
    };

    switch(direction) {
      case 'up':
        velocity.y = this.getVelocity(player.velocity.y, -player.speed);
        velocity.x = 0;
        break;
      case 'right':
        velocity.x = this.getVelocity(player.velocity.x, player.speed);
        velocity.y = 0;
        break;
      case 'down':
        velocity.y = this.getVelocity(player.velocity.y, player.speed);
        velocity.x = 0;
        break;
      case 'left':
        velocity.x = this.getVelocity(player.velocity.x, -player.speed);
        velocity.y = 0;
        break;
    }

    return velocity;
  }

  getVelocity(currentVelocity, newVelocity) {
    return currentVelocity === 0 ? newVelocity : currentVelocity;
  }

  changeVelocity(player, direction) {
    var velocity = { 
      x: player.velocity.x, 
      y: player.velocity.y
    };
    
    switch(direction) {
      case 'up':
        velocity.y = -player.speed;
        velocity.x = 0;
        break;
      case 'right':
        velocity.x = player.speed;
        velocity.y = 0;
        break;
      case 'down':
        velocity.y = player.speed;
        velocity.x = 0;
        break;
      case 'left':
        velocity.x = -player.speed;
        velocity.y = 0;
        break;
    }

    return velocity;
  }

  nextPosition(player, board, infinite) {
    var position = { 
      x: player.position.x + player.velocity.x, 
      y: player.position.y + player.velocity.y
    };
    
    var edge = { 
      x: board.size.x - player.size.x, 
      y: board.size.y - player.size.y 
    };

    if(infinite) {
      position.y = position.y < 0 ? edge.y : position.y;
      position.y = position.y > edge.y ? 0 : position.y;

      position.x = position.x < 0 ? edge.x : position.x;
      position.x = position.x > edge.x ? 0 : position.x
    } else {
      position.y = position.y < 0 ? 0 : position.y;
      position.y = position.y > edge.y ? edge.y : position.y;
  
      position.x = position.x < 0 ? 0 : position.x;
      position.x = position.x > edge.x ? edge.x : position.x;
    }

    return position;
  } 
}