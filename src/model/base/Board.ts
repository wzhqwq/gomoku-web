import RealObject from "./RealObject";

export default class Board implements RealObject {
  public matrix: number[][]
  public myChess: number

  constructor(matrix: number[][], myChess: number) {
    this.matrix = matrix
    this.myChess = myChess
  }
}