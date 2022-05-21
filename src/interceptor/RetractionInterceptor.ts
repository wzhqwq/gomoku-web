import eventDispatcher from "@event/eventDispatcher"
import RetractionEvent from "@event/RetractionEvent"
import BaseMessage from "@model/ws/BaseMessage"
import { MessageTypes } from "@model/ws/collection"
import RetractionRequestMessage from "@model/ws/RetractionRequestMessage"
import G from "@util/global"
import Interceptor from "./Interceptor"

export default class RetractionInterceptor implements Interceptor {
  preferredTypes: MessageTypes[] = ["retractionRequest"]

  intercept(message: BaseMessage): void {
    if (!(message instanceof RetractionRequestMessage)) return
    if (message.retraction.requestedBy === G.me.name) return
    eventDispatcher.dispatch("retraction", new RetractionEvent(message.retraction))
  }
}