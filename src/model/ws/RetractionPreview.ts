import PlayLog from "@model/base/PlayLog"
import Retraction from "@model/base/Retraction"
import BaseMessage from "./BaseMessage"
import BaseRequest from "./BaseRequest"

export default class RetractionPreviewMessage implements BaseMessage, BaseRequest {
  public readonly type: string = "retractionPreview"

  constructor (
    public readonly playLogs?: PlayLog[]
  ) {}

  public static fromRawObject(rawObject: any): RetractionPreviewMessage {
    return new RetractionPreviewMessage(
      rawObject.retractedLog.map(PlayLog.fromRawObject)
    )
  }

  public toJson(): string {
    return JSON.stringify({
      type: this.type,
      object: null
    })
  }
}