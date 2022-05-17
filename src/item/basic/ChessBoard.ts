import eventDispatcher from "@event/eventDispatcher";
import IndicatorChangedEvent from "@event/IndicatorChangedEvent";
import PlaceEvent from "@event/PlaceEvent";
import BoardTexture from "@texture/BoardTexture";
import { boardPadding, boardRadius, matrixGap } from "@util/constants";
import G from "@util/global";
import { ExtrudeBufferGeometry, ExtrudeGeometry, Group, Material, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshPhongMaterial, PlaneBufferGeometry, Shape, Vector3 } from "three";

export default class ChessBoard extends Group {
  private contentTexture: BoardTexture

  private lastCol: number = -1
  private lastRow: number = -1

  constructor(private size: number) {
    super()
    
    let width = (size - 1) * matrixGap + 2 * boardPadding;
    let baseMaterial = new MeshMatcapMaterial({
      matcap: G.matcaps.general,
      color: 0xffdb99,
    })
    this.contentTexture = new BoardTexture(size)
    let contentMaterial = new MeshBasicMaterial({
      map: this.contentTexture,
      transparent: true,
      // specular: 0xffffff,
    })

    let shape = new Shape()
    shape.moveTo(0, boardRadius)
    shape.lineTo(0, width - boardRadius)
    shape.bezierCurveTo(0, width, 0, width, boardRadius, width)
    shape.lineTo(width - boardRadius, width)
    shape.bezierCurveTo(width, width, width, width, width, width - boardRadius)
    shape.lineTo(width, boardRadius)
    shape.bezierCurveTo(width, 0, width, 0, width - boardRadius, 0)
    shape.lineTo(boardRadius, 0)
    shape.bezierCurveTo(0, 0, 0, 0, 0, boardRadius)

    let planeGeometry = new PlaneBufferGeometry(width, width)
    let boxGeometry = new ExtrudeGeometry(shape, {
      depth: 10,
      bevelSegments: 30,
      bevelSize: 5,
      bevelThickness: 5,
    })

    let base = new Mesh(boxGeometry, baseMaterial)
    let content = new Mesh(planeGeometry, contentMaterial)

    base.position.set(-width / 2, -width / 2, -20.01)
    content.position.set(0, 0, 0)
    this.add(base)
    this.add(content)

    G.pointerHandlers.set(content.uuid, {
      target: content,
      callback: this.handlePointer,
    })
  }

  public setIndicator(x: number, y: number) {
    this.contentTexture.drawIndicator(x, y)
    this.contentTexture.needsUpdate = true
  }

  public handlePointer = (type: string, point: Vector3): void => {
    if (type === "move") {
      let { x, y } = point
      let offset = matrixGap * (G.currentRoom.size - 1) / 2
      if (Math.abs(x) <= offset + matrixGap / 2 && Math.abs(y) <= offset + matrixGap / 2) {
        let row = Math.max(0, Math.round((offset - y) / matrixGap))
        let col = Math.max(0, Math.round((offset + x) / matrixGap))
        if (col !== this.lastCol || row !== this.lastRow) {
          this.lastCol = col
          this.lastRow = row
          eventDispatcher.dispatch("indicatorChanged", new IndicatorChangedEvent(col, row))
        }
      }
    }
    if (type === "click") {
      if (this.lastCol !== -1 && this.lastRow !== -1) {
        console.log(this.lastCol, this.lastRow)
        eventDispatcher.dispatch("place", new PlaceEvent(this.lastCol, this.lastRow))
        this.lastCol = this.lastRow = -1
      }
    }
  }
}