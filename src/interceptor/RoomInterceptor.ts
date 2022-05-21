import eventDispatcher from "@event/eventDispatcher"
import RoomUpdatedEvent from "@event/RoomUpdatedEvent"
import BaseMessage from "@model/ws/BaseMessage"
import { MessageTypes } from "@model/ws/collection"
import RoomMessage from "@model/ws/RoomMessage"
import Interceptor from "./Interceptor"

export default class RoomInterceptor implements Interceptor {
  preferredTypes: MessageTypes[] = ["gameInfo"]

  intercept(message: BaseMessage): void {
    if (!(message instanceof RoomMessage)) return

    const room = message.room
    eventDispatcher.dispatch("roomUpdated", new RoomUpdatedEvent(room))
  }
}