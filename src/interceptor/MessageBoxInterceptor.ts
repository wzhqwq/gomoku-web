import { GameOverEvent } from "@event/emptyEvents"
import eventDispatcher from "@event/eventDispatcher"
import PutMessageEvent from "@event/PutMessageEvent"
import RequestEvent from "@event/RequestEvent"
import BaseMessage from "@model/ws/BaseMessage"
import { MessageTypes } from "@model/ws/collection"
import GameOverMessage from "@model/ws/GameOverMessage"
import InstantMessage from "@model/ws/InstantMessage"
import RetractionRequestMessage from "@model/ws/RetractionRequestMessage"
import RetractionResultMessage from "@model/ws/RetractionResultMessage"
import G from "@util/global"
import Interceptor from "./Interceptor"

export default class MessageBoxInterceptor implements Interceptor {
  preferredTypes: MessageTypes[] = ["IM", "retractionRequest", "retractionResult", "gameOver"]
  intercept(message: BaseMessage): BaseMessage | void {
    if (message instanceof InstantMessage) {
      eventDispatcher.dispatch("putMessage", new PutMessageEvent({
        type: "IM",
        content: message.message,
        isMine: false
      }))
      return
    }
    if (message instanceof RetractionRequestMessage) {
      eventDispatcher.dispatch("putMessage", new PutMessageEvent({
        type: "system",
        content: `${
          message.retraction.requestedBy === G.me.name ? "您" : "对手"
        }请求了悔棋`,
        isMine: message.retraction.requestedBy === G.me.name
      }))
      return message
    }
    if (message instanceof RetractionResultMessage) {
      eventDispatcher.dispatch("putMessage", new PutMessageEvent({
        type: "system",
        content: `${
          message.retraction.requestedBy === G.me.name ? "对手" : "您"
        }${
          message.accepted ? "接受" : "拒绝"
        }了悔棋`,
        isMine: message.retraction.requestedBy !== G.me.name
      }))
      if (message.accepted) {
        eventDispatcher.dispatch("request", new RequestEvent("retraction"))
      }
      return message
    }
    if (message instanceof GameOverMessage) {
      eventDispatcher.dispatch("putMessage", new PutMessageEvent({
        type: "system",
        content: `${
          message.winner === G.me.name ? "您" : "对手"
        }获胜`,
        isMine: false
      }))
      eventDispatcher.dispatch("gameOver", new GameOverEvent())
      return
    }
  }
}
