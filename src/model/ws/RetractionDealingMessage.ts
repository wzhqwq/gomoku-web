import BaseRequest from "./BaseRequest"

export default class RetractionDealingMessage implements BaseRequest {
  public readonly type: string

  constructor (accepted: boolean) {
    this.type = accepted ? "retractionAccepted" : "retractionDenied"
  }

  public toJson(): string {
    return JSON.stringify({
      type: this.type,
      object: null
    })
  }
}