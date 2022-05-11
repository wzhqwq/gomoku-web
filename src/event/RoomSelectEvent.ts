import Room from "@model/base/Room"
import BaseEvent from "./BaseEvent"

export default class RoomSelectEvent implements BaseEvent {
  public TYPE = Symbol("RoomSelectEvent")
  public detail: RoomSelectEventDetail

  constructor(roomSelected: Room, finishCallback: (success: boolean) => void) {
    this.detail = { roomSelected, finishCallback }
  }
}

type RoomSelectEventDetail = {
  roomSelected: Room
  finishCallback: (success: boolean) => void
}