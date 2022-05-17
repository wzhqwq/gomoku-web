import BoardChangedEvent from "@event/BoardChangedEvent"
import eventDispatcher from "@event/eventDispatcher"
import PlayerRotateEvent from "@event/PlayerRotateEvent"
import Chess from "@model/base/Chess"
import BaseMessage from "@model/ws/BaseMessage"
import ChessboardMessage from "@model/ws/ChessboardMessage"
import PlaceMessage from "@model/ws/PlaceMessage"
import RetractionResultMessage from "@model/ws/RetractionResultMessage"
import G from "@util/global"
import Interceptor from "./Interceptor"

export default class ChessboardInterceptor implements Interceptor {
  preferredTypes: string[] = ["chessboard", "place", "retractionResult"]

  intercept(message: BaseMessage): BaseMessage | void {
    if (message instanceof ChessboardMessage) {
      let chesses: Chess[] = []
      message.board.matrix.forEach((row, x) => {
        row.forEach((type, y) => {
          if (type !== 0) {
            chesses.push(new Chess(x, y, type))
          }
        })
      })
      G.myChessType = message.board.myChess
      eventDispatcher.dispatch("boardChanged", new BoardChangedEvent(
        "load",
        chesses,
      ))
      eventDispatcher.dispatch("playerRotate", new PlayerRotateEvent(
        message.isMeNow
      ))
    }
    if (message instanceof PlaceMessage) {
      eventDispatcher.dispatch("boardChanged", new BoardChangedEvent(
        "add",
        [message.chess]
      ))
      eventDispatcher.dispatch("playerRotate", new PlayerRotateEvent(
        message.chess.type !== G.myChessType
      ))
    }
    if (message instanceof RetractionResultMessage) {
      eventDispatcher.dispatch("boardChanged", new BoardChangedEvent(
        "remove",
        message.retraction.retractedLog.map(log => log.chess)
      ))
      eventDispatcher.dispatch("playerRotate", new PlayerRotateEvent(
        message.retraction.requestedBy === G.me.name
      ))
    }
    return
  }
}