import * as $ from "jquery"
import Room from "@model/base/Room"
import G from "@util/global"
import NewRoom from "@view/NewRoom"
import SelectRoomEvent from "@event/SelectRoomEvent"
import eventDispatcher from "@event/eventDispatcher"
import AbstractStage from "@view/AbstractStage"
import WebSocketClient from "@util/WebSocketClient"
import ErrorMessage from "@model/ws/ErrorMessage"
import { ErrorDetail } from "@util/constants"
import UserInput from "@view/UserInput"
import Setting from "@model/local/Setting"
import Player from "@model/base/Player"
import DoCreateRoomEvent from "@event/DoCreateRoomEvent"

export default class RoomController {
  private rooms: Room[]

  // views
  private stage: AbstractStage = G.stage
  private newRoom: NewRoom = G.newRoom
  private userInput: UserInput = G.userInput

  constructor() {
    eventDispatcher.listen("selectRoom", this.enterRoom)
    eventDispatcher.listen("createRoom", this.createRoom)
    eventDispatcher.listen("fetchRooms", () => this.fetchRooms())
    eventDispatcher.listen("doCreateRoom", this.doCreateRoom)
  }

  public startRoom = () => {
    this.fetchRooms()
    this.stage.enterRoomPage()
  }

  public fetchRooms = async (updateStage: boolean = true): Promise<Room[]> => {
    this.stage.roomListLoading = true
    const data = await $.get({
      url: "http://" + G.setting.serverUrl + "/game/listGames",
      headers: {
        "Cross-Origin-Allow-Origin": "*"
      }
    }) as { data: any[] }
    this.rooms = data.data.map(raw => Room.fromRawObject(raw))
    this.stage.roomListLoading = false
    if (updateStage) this.stage.rooms = this.rooms
    return this.rooms
  }

  public createRoom = () => {
    this.newRoom.ask()
  }

  public doCreateRoom = (e: DoCreateRoomEvent): void => {
    if (!e) {
      this.newRoom.hideModal()
      return
    }
    let info = e.detail
    if (!info.roomName) {
      this.newRoom.showError("请输入房间名")
      return
    }
    this.newRoom.hideError()
    G.WSClient.connect(
      Room.createRoom(info.roomName, info.size),
      G.interceptors
    ).then(message => {
      if (message instanceof ErrorMessage) {
        switch (message.detail) {
          case ErrorDetail.HeaderNotSet:
            this.userInput.showError("昵称为空")
            this.updateSetting()
            break
          case ErrorDetail.DuplicatedUsername:
          case ErrorDetail.RoomIdentityOccupied:
            this.userInput.showError("昵称与在线用户重复，请更换昵称")
            this.updateSetting()
            break
          case ErrorDetail.RoomIsFull:
            this.newRoom.showError("您当前要加入的房间已满")
            break
        }
        return
      }
      this.newRoom.hideModal()
      this.fetchRooms(false).then(rooms => {
        G.currentRoom = rooms.find(room => room.roomName === info.roomName)
        this.stage.rooms = rooms
        if (!G.currentRoom) return
        this.stage.focusRoom(G.currentRoom)

        if (G.currentRoom.players.length === 2) {
          this.doEnterRoom(G.currentRoom)
        }
      })
    })
  }

  public enterRoom = (e: SelectRoomEvent) => {
    this.doEnterRoom(e.detail.roomSelected)
  }

  private async doEnterRoom(room: Room) {
    this.stage.focusRoom(room)
  }

  private updateSetting = async (): Promise<boolean> => {
    let settings = await this.userInput.ask(
      G.setting.nickname,
      G.setting.serverUrl
    )
    if (!settings) return false

    if (settings[1].match(/\/$/)) {
      settings[1] = settings[1].slice(0, -1)
    }
    G.setting = new Setting(settings[0], settings[1])
    G.setting.save()
    G.me = new Player(settings[0], true, null)
    this.userInput.hideModal()
    return true
  }
}