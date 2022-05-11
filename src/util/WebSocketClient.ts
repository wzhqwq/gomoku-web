import Room from "@model/base/Room";
import { stringify } from "qs";
import G from "./global";

export default class WebSocketClient {
  private session: WebSocket = null

  constructor(room: Room) {
    this.session = new WebSocket(`ws://${G.setting.serverUrl}/ws?${stringify({
      "Username": G.me.name,
      "GameName": room.gameName,
      "ChessboardSize": room.size,
    })}`)
  }
}