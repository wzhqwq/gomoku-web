import Room from "@model/base/Room"
import RoomInfo from "./RoomInfo"
import { removeSideEffects } from "@util/utils"
import BaseGroup from "@item/UI/BaseGroup"

export default class RoomList extends BaseGroup {
  private name2Room: Map<string, RoomInfo> = new Map()

  constructor() {
    super()
  }

  public set rooms(rooms: Room[]) {
    let newComerRooms: RoomInfo[] = [], existRooms: RoomInfo[] = []
    rooms.forEach(room => {
      let roomInfo = this.name2Room.get(room.roomName)
      if (roomInfo) {
        existRooms.push(roomInfo)
        this.name2Room.delete(room.roomName)
        roomInfo.repaintInfo(room)
      } else {
        newComerRooms.push(new RoomInfo(room))
      }
    })
    
    this.name2Room.forEach(roomInfo => {
      this.remove(roomInfo)
      removeSideEffects(roomInfo)
    })
    this.name2Room.clear()

    newComerRooms.forEach(roomInfo => {
      roomInfo.animationEnabled = false
      roomInfo.hidden = true
      roomInfo.animationEnabled = true
      roomInfo.position.set(0, -800, 0)
      this.name2Room.set(roomInfo.room.roomName, roomInfo)
      this.add(roomInfo)
    })
    existRooms.forEach(roomInfo => {
      this.name2Room.set(roomInfo.room.roomName, roomInfo)
    })

    this.rearrange()
  }

  public rearrange(): void {
    let colNum = Math.floor((this.width + 40) / 380)
    let startX = -this.width / 2 + 10, startY = this.height / 2 - 140
    let roomInfos = this.children as RoomInfo[]
    roomInfos.forEach((roomInfo, index) => {
      if (roomInfo.hidden) roomInfo.hidden = false
      roomInfo.slideTo(
        startX + (index % colNum) * 380,
        startY - Math.floor(index / colNum) * 140,
        0
      )
    })
  }

  public set viewWidth(width: number) {
    this.setViewSize(width, this.height)
  }

  public set viewHeight(height: number) {
    this.setViewSize(this.width, height)
  }

  public setViewSize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.rearrange()
  }
}