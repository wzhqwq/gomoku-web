import BaseMessage from "@model/ws/BaseMessage"
import ErrorMessage from "@model/ws/ErrorMessage"
import InstantMessage from "@model/ws/InstantMessage"
import Interceptor from "./Interceptor"

export default class MessageBoxInterceptor implements Interceptor {
  preferredTypes: string[] = ["IM"]
  intercept(message: BaseMessage): ErrorMessage | void {
    if (!(message instanceof InstantMessage)) return
    
  }
}
