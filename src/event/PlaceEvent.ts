import BaseEvent from "./BaseEvent"

export default class PlaceEvent implements BaseEvent {
  public TYPE = Symbol("PlaceEvent")
  public detail: {
    x: number
    y: number
  }

  constructor(x: number, y: number) {
    this.detail = { x, y }
  }
}