import Retraction from "@model/base/Retraction"
import BaseMessage from "./BaseMessage"
import BaseRequest from "./BaseRequest"

export default class RetractionRequestMessage implements BaseMessage, BaseRequest {
  public readonly type: string = "retractionRequest"

  constructor (
    public readonly myChess?: number,
    public readonly retraction?: Retraction
  ) {}

  public static fromRawObject(rawObject: any): RetractionRequestMessage {
    return new RetractionRequestMessage(
      rawObject.myChess,
      Retraction.fromRawObject(rawObject.retraction)
    )
  }

  public toJson(): string {
    return JSON.stringify({
      type: this.type,
      object: null
    })
  }
}