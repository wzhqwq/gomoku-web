import Room from "@model/base/Room"
import BaseMessage from "./BaseMessage"

export default class RoomMessage implements BaseMessage {
  public readonly type: string = "gameInfo"
  public readonly room: Room

  constructor (object: any) {
    this.room = Room.fromRawObject(object.gameInfo)
  }
}