import Retraction from "@model/base/Retraction"
import BaseEvent from "./BaseEvent"

export default class RetractionEvent implements BaseEvent {
  public TYPE = Symbol("RetractionEvent")
  public detail: {
    retraction: Retraction
  }

  constructor(retraction: Retraction) {
    this.detail = { retraction }
  }
}