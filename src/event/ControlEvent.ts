import BaseEvent from "./BaseEvent"

export default class ControlEvent implements BaseEvent {
  public TYPE = Symbol("ControlEvent")
  public detail: {
    type: "leave" | "retract",
  }

  constructor(type: "leave" | "retract") {
    this.detail = { type }
  }
}