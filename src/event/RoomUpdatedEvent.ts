import Room from "@model/base/Room"
import BaseEvent from "./BaseEvent"

export default class RoomUpdatedEvent implements BaseEvent {
  public TYPE = Symbol("RoomUpdatedEvent")
  public detail: Room

  constructor(room: Room) {
    this.detail = room
  }
}