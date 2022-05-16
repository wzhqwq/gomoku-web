import Chess from "@model/base/Chess"
import BaseEvent from "./BaseEvent"

export default class PlayerRotateEvent implements BaseEvent {
  public TYPE = Symbol("PlayerRotateEvent")
  public detail: {
    isMeNow: boolean
  }

  constructor(isMeNow: boolean) {
    this.detail = { isMeNow }
  }
}