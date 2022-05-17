import Chess from "@model/base/Chess"
import BaseEvent from "./BaseEvent"

export default class BoardChangedEvent implements BaseEvent {
  public TYPE = Symbol("BoardChangedEvent")
  public detail: {
    type: "add" | "remove" | "load",
    chesses: Chess[],
  }

  constructor(type: "add" | "remove" | "load", chesses: Chess[]) {
    this.detail = { type, chesses }
  }
}