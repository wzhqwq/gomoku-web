import * as $ from "jquery"
import Room from "@model/base/Room"
import G from "@util/global"
import NewRoom from "@view/NewRoom"
import RoomSelectEvent from "@event/RoomSelectEvent"
import eventDispatcher from "@event/eventDispatcher"
import AbstractStage from "@view/AbstractStage"

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
    // this.fetchRooms()
    this.stage.enterRoomPage()
    this.stage.rooms = [
      new Room({
        size: 20,
        gameName: "asdfasasdfdsf",
        isGameStarted: true,
        isGameOver: true,
        users: [
          {
            username: "adssdafsdffas"
          }, {
            username: "adssdafsdffas"
          }
        ]
      }),
      new Room({
        size: 15,
        gameName: "retwrarfw",
        isGameStarted: false,
        users: [
          {
            username: "adssdafsdffas"
          }
        ]
      })
    ]
  }

  public fetchRooms = () => {
    this.stage.roomListLoading = true
    $.get({
      url: "http://" + G.setting.serverUrl + "/game/listGames",
      headers: {
        "Cross-Origin-Allow-Origin": "*"
      }
    })
      .then(data => {
        this.rooms = data.data.map(raw => new Room(raw))
        this.stage.roomListLoading = false
        this.stage.rooms = this.rooms
      })
  }

  public createRoom = () => {
    this.newRoom.ask().then(roomName => {
      this.newRoom.hideModal()
      if (roomName) {
      }
    })
  }

  public enterRoom = (room: RoomSelectEvent) => {
  }
}