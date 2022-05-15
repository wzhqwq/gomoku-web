import BaseEvent from "./BaseEvent"

export default class IndicatorChangedEvent implements BaseEvent {
  public TYPE = Symbol("IndicatorChangedEvent")
  public detail: {
    x: number
    y: number
  }

  constructor(x: number, y: number) {
    this.detail = { x, y }
  }
}