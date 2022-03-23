// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = Array(8).fill(null).map(() => Array(8));
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7){
    return false;
  }
  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    return this.grid[pos[0]][pos[1]];
  }else{
    throw new Error('Not valid pos!');
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let pieceExists = this.getPiece(pos);
  if (pieceExists && pieceExists.color === color) {
    return true;
  }
  return false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.getPiece(pos)) {
    return true;
  }else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  let positions = piecesToFlip ? piecesToFlip : [];
  let current = [pos[0] + dir[0], pos[1] + dir[1]];
  if (!this.isValidPos(current) || !this.isOccupied(current)) {
    return [];
  } else if (this.isMine(current, color)) {
    return positions;
  }
  positions.push(current);
  return this._positionsToFlip(current, color, dir, positions);
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }
  let directions = [[0, 1], [1, 0], [1, 1], [0, -1], 
                    [1, -1], [-1, 1], [-1, -1], [-1, 0]];
  for(let i = 0; i < directions.length; i++) {
    if (this._positionsToFlip(pos, color, directions[i]).length > 0) {
      return true;
    }
  }  
  return false;   
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error("Invalid move!");
  }
  this.grid[pos[0]][pos[1]] = new Piece(color);
  let positions = [];
  let directions = [[0, 1], [1, 0], [1, 1], [0, -1],
  [1, -1], [-1, 1], [-1, -1], [-1, 0]];
  for (let i = 0; i < directions.length; i++) {
    positions = positions.concat(this._positionsToFlip(pos, color, directions[i]));
  }
  for (let i = 0; i < positions.length; i++) {
    this.grid[positions[i][0]][positions[i][1]].flip();
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let positions = [];
  for(let i = 0; i < this.grid.length;i++){
    for (let j = 0; j < this.grid.length; j++) {
      if (!this.isOccupied([i,j]) && this.validMove([i,j],color)) {
        positions.push([i,j]);
      }
    }
  }
  return positions;
};

Board._prototype.aiMoves = function (color) {
  let moves = this.validMoves(color);
  let data = [];
  let directions = [[0, 1], [1, 0], [1, 1], [0, -1],
  [1, -1], [-1, 1], [-1, -1], [-1, 0]];
  for (let j = 0; j < moves.length; j++) {
    let positions = [];
    for (let i = 0; i < directions.length; i++) {
      positions = positions.concat(this._positionsToFlip(moves[j], color, directions[i]));
    }
    data.push(moves[j],positions.length());
  }
  return data;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return (this.validMoves(color).length > 0);
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("white") && !this.hasMove("black"));
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      if (this.isOccupied([i,j])) {
        process.stdout.write(`[${this.grid[i][j].toString()}]`);
      }else{
        process.stdout.write("[ ]");
      }
    }
    console.log("");
  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE