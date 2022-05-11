import { Group, Mesh } from "three"
import Room from "@model/base/Room"
import G from "@util/global"
import RoomInfo from "./RoomInfo"

export default class RoomList extends Group {
  private _width: number
  private _height: number

  constructor(width: number, height: number) {
    super()
    this._width = width
    this._height = height
  }

  public set rooms(rooms: Room[]) {
    this.traverse(item => {
      if (item instanceof Mesh) {
        let t = item as Mesh
        t.geometry.dispose()
        if (G.mixers.has(t.uuid)) {
          G.mixers.get(t.uuid).stopAllAction()
          G.mixers.delete(t.uuid)
        }
        if (G.pointerHandlers.has(t.uuid)) {
          G.pointerHandlers.delete(t.uuid)
        }
      }
    })
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