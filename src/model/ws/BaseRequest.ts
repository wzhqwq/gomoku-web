import BaseMessage from "./BaseMessage"

export default interface BaseRequest extends BaseMessage {
  toJson(): string
}