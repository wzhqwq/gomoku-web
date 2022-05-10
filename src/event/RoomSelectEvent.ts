import Room from "../model/base/Room"

export default class RoomSelectEvent {
  public static TYPE = Symbol("RoomSelectEvent")
  public roomSelected: Room
  public finishCallback: (success: boolean) => void

  constructor(roomSelected: Room, finishCallback: (success: boolean) => void) {
    this.roomSelected = roomSelected
    this.finishCallback = finishCallback
  }
}