import BaseEvent from "./BaseEvent"

export default class RequestEvent implements BaseEvent {
  public TYPE = Symbol("RequestEvent")
  public detail: {
    type: "retraction"
  }

  constructor(type: "retraction") {
    this.detail = { type }
  }
}