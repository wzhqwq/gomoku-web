import * as $ from "jquery"
import Room from "@model/base/Room"
import G from "@util/global"
import NewRoom from "@view/NewRoom"
import RoomSelectEvent from "@event/RoomSelectEvent"
import eventDispatcher from "@event/eventDispatcher"
import AbstractStage from "@view/AbstractStage"
import WebSocketClient from "@util/WebSocketClient"

export default class RoomController {
  private rooms: Room[]

  // views
  private stage: AbstractStage = G.stage
  private newRoom: NewRoom = G.newRoom

  constructor() {
    eventDispatcher.listen("selectRoom", this.enterRoom)
    eventDispatcher.listen("createRoom", this.createRoom)
    eventDispatcher.listen("fetchRooms", this.fetchRooms)
  }

  public startRoom = () => {
    this.fetchRooms()
    this.stage.enterRoomPage()
  }

  public fetchRooms = () => {
    this.stage.roomListLoading = true
    $.get({
      url: "http://" + G.setting.serverUrl + "/game/listGames",
      headers: {
        "Cross-Origin-Allow-Origin": "*"
      }
    })
      .then((data: { data: any[] }) => {
        this.rooms = data.data.map(raw => Room.fromRawObject(raw))
        this.stage.roomListLoading = false
        this.stage.rooms = this.rooms
      })
  }

  public createRoom = () => {
    this.newRoom.ask().then(info => {
      this.newRoom.hideModal()
      if (info) {
        G.WSClient = new WebSocketClient(
          Room.createRoom(info.roomName, info.size),
          G.interceptors
        )
      }
    })
  }

  public enterRoom = (room: RoomSelectEvent) => {
  }
}