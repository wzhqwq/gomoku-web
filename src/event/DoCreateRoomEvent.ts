import { RoomInfoType } from "@view/NewRoom"
import BaseEvent from "./BaseEvent"

export default class DoCreateRoomEvent implements BaseEvent {
  public TYPE = Symbol("DoCreateRoomEvent")
  public detail: RoomInfoType

  constructor(detail: RoomInfoType) {
    this.detail = detail
  }
}
