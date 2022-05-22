import Board from "@model/base/Board"
import BaseMessage from "./BaseMessage"
import BaseRequest from "./BaseRequest"

export default class ChessboardMessage implements BaseMessage, BaseRequest {
  public readonly type: string = "chessboard"

  constructor(
    public readonly board?: Board,
    public readonly isMeNow?: boolean,
    public readonly isGameStarted?: boolean,
    public readonly isGameOver?: boolean,
  ) {}

  public static fromRawObject(rawObject: any): ChessboardMessage {
    return new ChessboardMessage(
      Board.fromRawObject(rawObject),
      rawObject.isMeNow,
      rawObject.isGameStarted,
      rawObject.isGameOver,
    )
  }

  public toJson(): string {
    return JSON.stringify({
      type: this.type,
    })
  }
}