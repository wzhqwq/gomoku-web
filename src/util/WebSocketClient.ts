import Interceptor from "@interceptor/Interceptor";
import Room from "@model/base/Room";
import BaseMessage from "@model/ws/BaseMessage";
import BaseRequest from "@model/ws/BaseRequest";
import ErrorMessage from "@model/ws/ErrorMessage";
import RawMessage from "@model/ws/RawMessage"
import { stringify } from "qs";
import G from "./global";

export default class WebSocketClient {
  private session: WebSocket = null
  private sendResolver: (message: BaseMessage | void) => void = null

  constructor(room: Room, interceptors: Interceptor[]) {
    this.session = new WebSocket(`ws://${G.setting.serverUrl}/ws?${stringify({
      "Username": G.me.name,
      "GameName": room.gameName,
      "ChessboardSize": room.size,
    })}`)

    this.session.onclose = () => {
      this.session = null
    }

    this.session.onmessage = (event) => {
      const message = new RawMessage(JSON.parse(event.data))
      const intercepted = interceptors.reduce((message, interceptor) => {
        if (!message) return
        if (!interceptor.preferredTypes || interceptor.preferredTypes.includes(message.type)) {
          return interceptor.intercept(message)
        }
      }, message)
      this.sendResolver?.(intercepted)
      this.sendResolver = null
    }
  }

  public get isOpened(): boolean {
    return this.session !== null
  }

  public dispose(): void {
    if (this.session !== null) {
      this.session.close()
      this.session = null
    }
  }

  public send(message: BaseRequest): Promise<BaseMessage | void> {
    return new Promise(res => {
      if (this.session === null) {
        res()
        return
      }
      this.session.send(message.toJson())
      this.sendResolver = res
      setTimeout(() => {
        res(new ErrorMessage("timeout"))
      }, 10000)
    })
  }
}