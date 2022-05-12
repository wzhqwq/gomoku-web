import BaseMessage from "@model/ws/BaseMessage"
import ChessboardMessage from "@model/ws/ChessboardMessage"
import ErrorMessage from "@model/ws/ErrorMessage"
import RawMessage from "@model/ws/RawMessage"
import Interceptor from "./Interceptor"

export default class RawInterceptor implements Interceptor {
  preferredTypes: string[] = null

  intercept(message: BaseMessage): ErrorMessage | ChessboardMessage {
    if (!(message instanceof RawMessage)) return
    switch (message.type) {
      case "error":
        return new ErrorMessage(message.object)
      case "chessboard":
        return new ChessboardMessage(message.object)
      default:
        return null
    }
  }
}