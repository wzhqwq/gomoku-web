import Board from "@model/base/Board"
import BaseMessage from "./BaseMessage"

export default class ChessboardMessage implements BaseMessage {
  code: number
  type: string

  board: Board
  isMeNow: boolean

  constructor(object: any) {
    this.code = object.code
    this.type = object.type
    this.board = new Board(object.chessboard, object.myChess)
    this.isMeNow = object.isMeNow
  }
}