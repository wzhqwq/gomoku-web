import BaseEvent from "./BaseEvent"

export default class SendMessageEvent implements BaseEvent {
  public TYPE = Symbol("SendMessageEvent")
  public detail: {
    content: string
  }

  constructor(content: string) {
    this.detail = { content }
  }
}