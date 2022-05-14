import BaseMessage from "./BaseMessage"

export default class ErrorMessage implements BaseMessage {
  public readonly type: string = "error"
  public readonly detail: string

  constructor (object: any) {
    this.detail = object
  }
}