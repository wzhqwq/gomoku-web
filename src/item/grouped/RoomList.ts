import { Group, Mesh } from "three"
import Room from "@model/base/Room"
import G from "@util/global"
import RoomInfo from "./RoomInfo"
import { removeResources } from "@util/utils"

export default class RoomList extends Group {
  private _width: number
  private _height: number

  constructor(width: number, height: number) {
    super()
    this._width = width
    this._height = height
  }

  public set rooms(rooms: Room[]) {
    removeResources(this)
    this.remove(...this.children)
    if (rooms.length === 0) return
    this.add(...rooms.map(room => new RoomInfo(room)))
    this.rearrange()
  }

  public rearrange(): void {
    let colNum = Math.floor((this._width + 40) / 380)
    let startX = -this._width / 2 + 10, startY = this._height / 2 - 140
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].position.set(
        startX + (i % colNum) * 380,
        startY - Math.floor(i / colNum) * 140,
        0
      )
    }
  }

  public set width(width: number) {
    if (this._width === width) return
    this._width = width
    this.rearrange()
  }

  public set height(height: number) {
    if (this._height === height) return
    this._height = height
    this.rearrange()
  }
}