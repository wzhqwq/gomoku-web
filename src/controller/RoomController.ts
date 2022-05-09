import * as $ from "jquery"
import Room from "../model/base/Room"
import G from "../util/global"
import Stage from "../view/Stage"

export default class RoomController {
  private rooms: Room[]

  // views
  private stage: Stage = G.stage

  constructor() {
    this.stage.bindRoomRefresh(this.fetchRooms.bind(this))
  }

  public startRoom(): void {
    // this.fetchRooms()
    this.stage.enterRoomPage()
    this.stage.rooms = [
      new Room({
        size: 20,
        gameName: "asdfasasdfdsf",
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
        users: [
          {
            username: "adssdafsdffas"
          }
        ]
      })
    ]
  }

  private fetchRooms(): void {
    this.stage.roomListLoading = true
    $.get({
      url: G.setting.serverUrl + "/game/listGames",
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
}