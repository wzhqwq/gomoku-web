import Room from "@model/base/Room"
import RoomInfo from "./RoomInfo"
import { removeResources } from "@util/utils"
import BaseGroup from "@item/UI/BaseGroup"

export default class RoomList extends BaseGroup {
  constructor(viewWidth: number, viewHeight: number) {
    super()
    this.setViewSize(viewWidth, viewHeight)
  }

  public set rooms(rooms: Room[]) {
    removeResources(this)
    this.remove(...this.children)
    if (rooms.length === 0) return
    this.add(...rooms.map(room => new RoomInfo(room)))
    this.rearrange()
  }

  public rearrange(): void {
    let colNum = Math.floor((this.width + 40) / 380)
    let startX = -this.width / 2 + 10, startY = this.height / 2 - 140
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].position.set(
        startX + (i % colNum) * 380,
        startY - Math.floor(i / colNum) * 140,
        0
      )
    }
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