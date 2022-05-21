import BaseMessage from "@model/ws/BaseMessage"
import { MessageTypes } from "@model/ws/collection"
import ErrorMessage from "@model/ws/ErrorMessage"
import Interceptor from "./Interceptor"

export default class ErrorInterceptor implements Interceptor {
  preferredTypes: MessageTypes[] = ["error"]
  intercept(message: BaseMessage): ErrorMessage | void {
    if (!(message instanceof ErrorMessage)) return
    console.log("WS Error: " + message.detail)
    switch (message.detail) {
      default:
        return message
    }
  }
}
