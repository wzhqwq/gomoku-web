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

  public async rearrange(): Promise<void> {
    let colNum = Math.floor((this.width + 40) / 380)
    let startX = -this.width / 2 + 10, startY = this.height / 2 - 140
    let roomInfos = this.children as RoomInfo[]
    let promises = []
    roomInfos.forEach((roomInfo, index) => {
      if (roomInfo.hidden) roomInfo.hidden = false
      promises.push(roomInfo.slideTo(
        startX + (index % colNum) * 380,
        startY - Math.floor(index / colNum) * 140,
        0
      ))
    })
    await Promise.all(promises)
  }

  public async focus(roomName: string): Promise<boolean> {
    let roomInfo = this.name2Room.get(roomName)
    if (roomInfo) {
      this.name2Room.forEach((roomInfo, name) => {
        if (name === roomName) return
        roomInfo.hidden = true
      })
      await roomInfo.slideTo(-roomInfo.width / 2, -roomInfo.height / 2, 100)
      return true
    }
    return false
  }

  public set viewWidth(width: number) {
    this.setViewSize(width, this.height)
  }

  public set viewHeight(height: number) {
    this.setViewSize(this.width, height)
  }

  public setViewSize(width: number, height: number): Promise<void> {
    this.width = width
    this.height = height
    return this.rearrange()
  }
}