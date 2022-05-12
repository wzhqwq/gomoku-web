import BaseMessage from "@model/ws/BaseMessage"
import ChessboardMessage from "@model/ws/ChessboardMessage"
import Interceptor from "./Interceptor"

export default class ChessboardInterceptor implements Interceptor {
  preferredTypes: string[] = ["chessboard"]

  intercept(message: BaseMessage): void {
    if (!(message instanceof ChessboardMessage)) return
  }
}