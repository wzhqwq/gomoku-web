import Retraction from "@model/base/Retraction"
import BaseMessage from "./BaseMessage"

export default class RetractionResultMessage implements BaseMessage {
  public readonly type: string = "retractionResult"
  public readonly retraction: Retraction
  public readonly myChess: number
  public readonly accepted: boolean

  constructor (object: any) {
    this.retraction = Retraction.fromRawObject(object.retraction)
    this.myChess = object.myChess
    this.accepted = object.accepted
  }
}