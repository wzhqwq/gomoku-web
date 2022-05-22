import BaseMessage from "@model/ws/BaseMessage"
import ChessboardMessage from "@model/ws/ChessboardMessage"
import { MessageTypes } from "@model/ws/collection"
import ErrorMessage from "@model/ws/ErrorMessage"
import GameOverMessage from "@model/ws/GameOverMessage"
import InstantMessage from "@model/ws/InstantMessage"
import PlaceMessage from "@model/ws/PlaceMessage"
import RawMessage from "@model/ws/RawMessage"
import RetractionPreviewMessage from "@model/ws/RetractionPreview"
import RetractionRequestMessage from "@model/ws/RetractionRequestMessage"
import RetractionResultMessage from "@model/ws/RetractionResultMessage"
import RoomMessage from "@model/ws/RoomMessage"
import Interceptor from "./Interceptor"

export default class RawInterceptor implements Interceptor {
  preferredTypes: MessageTypes[] = null

  intercept(message: BaseMessage): BaseMessage {
    if (!(message instanceof RawMessage)) return null
    switch (message.type) {
      case "error":
        return new ErrorMessage(message.object)
      case "gameInfo":
        return new RoomMessage(message.object)
      case "gameOver":
        return new GameOverMessage(message.object)
      case "IM":
        return InstantMessage.fromRawObject(message.object)
      case "place":
        return PlaceMessage.fromRawObject(message.object)
      case "chessboard":
        return ChessboardMessage.fromRawObject(message.object)
      case "retractionPreview":
        return RetractionPreviewMessage.fromRawObject(message.object)
      case "retractionRequest":
        return RetractionRequestMessage.fromRawObject(message.object)
      case "retractionResult":
        return new RetractionResultMessage(message.object)
      default:
        return null
    }
  }
}