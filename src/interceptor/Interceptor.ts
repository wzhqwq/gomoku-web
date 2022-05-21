import BaseMessage from "@model/ws/BaseMessage";
import { MessageTypes } from "@model/ws/collection";
import WebSocketClient from "@util/WebSocketClient";

export default interface Interceptor {
  preferredTypes: MessageTypes[]

  intercept(message: BaseMessage, client?: WebSocketClient): BaseMessage | void
}