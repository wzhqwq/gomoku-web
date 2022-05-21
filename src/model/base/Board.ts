export default class Board {
  constructor(
    public matrix: number[][],
    public myChess: number
  ) {}

  public static fromRawObject(rawObject: any): Board {
    return new Board(rawObject.chessboard, rawObject.myChess)
  }
}