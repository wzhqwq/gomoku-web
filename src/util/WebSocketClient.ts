import Interceptor from "@interceptor/Interceptor";
import Room from "@model/base/Room";
import BaseMessage from "@model/ws/BaseMessage";
import BaseRequest from "@model/ws/BaseRequest";
import { MessageTypes } from "@model/ws/collection";
import ErrorMessage from "@model/ws/ErrorMessage";
import RawMessage from "@model/ws/RawMessage"
import { stringify } from "qs";
import G from "./global";

export default class WebSocketClient {
  private session: WebSocket = null
  private sendResolver: (message: BaseMessage | void) => void = null

  public get isOpened(): boolean {
    return this.session !== null
  }

  public disconnect(): void {
    if (this.session !== null) {
      this.session.close()
      this.session = null
    }
  }

  public connect(room: Room, interceptors: Interceptor[]): Promise<BaseMessage | void> {
    if (this.isOpened) this.disconnect()
    this.session = new WebSocket(`ws://${G.setting.serverUrl}/ws?${stringify({
      "Username": G.me.name,
      "GameName": room.roomName,
      "ChessboardSize": room.size,
    })}`)

    this.session.onclose = () => {
      this.session = null
    }

    this.session.onmessage = (event) => {
      const message = new RawMessage(JSON.parse(event.data))
      const intercepted = interceptors.reduce((message, interceptor) => {
        if (!message) return
        if (!interceptor.preferredTypes || interceptor.preferredTypes.includes(message.type as MessageTypes)) {
          return interceptor.intercept(message)
        }
        return message
      }, message)
      if (!intercepted) return
      this.sendResolver?.(intercepted)
      this.sendResolver = null
    }

    return new Promise(res => {
      this.sendResolver = res
    })
  }

  public send(message: BaseRequest): Promise<BaseMessage | void> {
    if (this.session === null) {
      return Promise.resolve()
    }
    return new Promise(res => {
      this.session.send(message.toJson())
      this.sendResolver = res
      setTimeout(() => {
        if (this.sendResolver) {
          res(new ErrorMessage("timeout"))
        }
      }, 10000)
    })
  }
}