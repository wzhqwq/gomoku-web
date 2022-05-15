import Room from "@model/base/Room"
import BaseEvent from "./BaseEvent"

export default class SelectRoomEvent implements BaseEvent {
  public TYPE = Symbol("SelectRoomEvent")
  public detail: RoomSelectEventDetail

  constructor(roomSelected: Room) {
    this.detail = { roomSelected }
  }
}

type RoomSelectEventDetail = {
  roomSelected: Room
}