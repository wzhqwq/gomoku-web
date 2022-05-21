import Message from "@model/base/Message"
import BaseEvent from "./BaseEvent"

export default class PutMessageEvent implements BaseEvent {
  public TYPE = Symbol("PutMessageEvent")
  public detail: {
    content: Message
  }

  constructor(content: Message) {
    this.detail = { content }
  }
}