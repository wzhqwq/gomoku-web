import BaseMessage from "./BaseMessage"
import BaseRequest from "./BaseRequest"

export default class InstantMessage implements BaseMessage, BaseRequest {
  public readonly type: string = "IM"

  constructor (
    public readonly message: string
  ) {}

  public static fromRawObject(rawObject: any): InstantMessage {
    return new InstantMessage(rawObject.content)
  }

  toJson(): string {
    return JSON.stringify({
      type: this.type,
      object: { content: this.message }
    })
  }
}