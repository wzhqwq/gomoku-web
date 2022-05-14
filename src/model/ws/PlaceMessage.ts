import Chess from '@model/base/Chess'
import BaseMessage from './BaseMessage'
import BaseRequest from './BaseRequest'
export default class PlaceMessage implements BaseMessage, BaseRequest {
  public readonly type: string = "place"

  constructor(
    public readonly chess: Chess
  ) {}

  public static fromRawObject(rawObject: any): PlaceMessage {
    return new PlaceMessage(new Chess(rawObject.x, rawObject.y, rawObject.type))
  }

  public toJson(): string {
    return JSON.stringify({
      type: this.type,
      object: this.chess
    })
  }
}