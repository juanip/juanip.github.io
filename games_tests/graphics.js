class Graphics { 
  drawBoard(context, board) {
  
    boardContext.fillStyle = board.score.background;
    boardContext.fillRect(0, 0, board.size.x, board.offset.y);
  
    boardContext.fillStyle = board.color;
    boardContext.clearRect(0 + board.offset.x, 0 + board.offset.y, board.size.x, board.size.y);
    boardContext.fillRect(0 + board.offset.x, 0 + board.offset.y, board.size.x, board.size.y);
  }
  
  drawText(context, options) {
  
    boardContext.fillStyle = options.color;
    boardContext.font = options.font;
    boardContext.fillText(options.text, options.position.x , options.position.y);
  }
  
  drawRect(context, body, board) {
    var x = body.position.x + board.offset.x;
    var y = body.position.y + board.offset.y;
  
    context.fillStyle = body.color;
    context.fillRect(x, y, body.size.x, body.size.y);
  }
}