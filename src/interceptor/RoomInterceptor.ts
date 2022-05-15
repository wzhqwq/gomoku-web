import BaseMessage from "@model/ws/BaseMessage"
import RoomMessage from "@model/ws/RoomMessage"
import G from "@util/global"
import Interceptor from "./Interceptor"

export default class RoomInterceptor implements Interceptor {
  preferredTypes: string[] = ["gameInfo"]

  intercept(message: BaseMessage): void {
    if (!(message instanceof RoomMessage)) return

    const room = message.room
    G.roomController.updateRoom(room)
  }
}