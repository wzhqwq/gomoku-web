import BaseMessage from "./BaseMessage"

export default class RawMessage implements BaseMessage {
  code: number
  type: string
  object: any

  constructor (response: any) {
    this.code = response.code
    this.type = response.type
    this.object = response.object
  }
}