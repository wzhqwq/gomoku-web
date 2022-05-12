import BaseMessage from "@model/ws/BaseMessage";
import WebSocketClient from "@util/WebSocketClient";

export default interface Interceptor {
  preferredTypes: string[]

  intercept(message: BaseMessage, client?: WebSocketClient): BaseMessage | void
}