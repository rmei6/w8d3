function AIPlayer (board,color) {
    this.name = "Ben";
    this.board = board;
    this.color = color;
}

AIPlayer._prototype.playTurn = function () {
    let position = this.getBestmove();
};

AIPlayer._prototype.getMoves = function () {
    return this.board.aiMoves(this.color);
};

AIPlayer._prototype.getBestmove = function () {
    let moves = this.getMoves();
    pos = moves[0]
    for (let i = 0; i < moves.length;i++){
        if (moves[i][1] > pos[1]){
            pos = moves[i];
        }
    }
    return pos[0];
};