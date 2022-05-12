import BaseMessage from "./BaseMessage"

export default class ErrorMessage implements BaseMessage {
  code: number = -1
  type: string = "error"
  detail: string

  constructor (object: any) {
    this.detail = object
  }
}