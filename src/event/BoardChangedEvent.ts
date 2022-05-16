import Chess from "@model/base/Chess"
import BaseEvent from "./BaseEvent"

export default class BoardChangedEvent implements BaseEvent {
  public TYPE = Symbol("BoardChangedEvent")
  public detail: {
    type: "add" | "remove",
    chesses: Chess[],
    myChess?: number,
  }

  constructor(type: "add" | "remove", chesses: Chess[], myChess?: number) {
    this.detail = { type, chesses, myChess }
  }
}