import BaseMessage from "./BaseMessage"

export default interface extends BaseMessage {
  toJson(): string
}