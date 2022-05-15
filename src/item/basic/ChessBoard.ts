import BoardTexture from "@texture/BoardTexture";
import { boardPadding, boardRadius, matrixGap } from "@util/constants";
import G from "@util/global";
import { ExtrudeBufferGeometry, ExtrudeGeometry, Group, Material, Mesh, MeshMatcapMaterial, MeshPhongMaterial, PlaneBufferGeometry, Shape } from "three";

export default class ChessBoard extends Group {
  private content: Mesh

  constructor(private size: number) {
    super()
    
    let width = (size - 1) * matrixGap + 2 * boardPadding;
    let baseMaterial = new MeshMatcapMaterial({
      matcap: G.matcaps.general,
      color: 0xffdb99,
    })
    let contentMaterial = new MeshPhongMaterial({
      map: new BoardTexture(size),
      transparent: true,
      specular: 0xffffff,
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
    this.content = new Mesh(planeGeometry, contentMaterial)

    base.position.set(-width / 2, -width / 2, -20.01)
    this.content.position.set(0, 0, 0)
    this.add(base)
    this.add(this.content)
  }

  public setIndicator(x: number, y: number) {
    (this.content.material as Material).dispose()
    this.content.material = new MeshPhongMaterial({
      map: new BoardTexture(this.size, x, y),
      transparent: true,
      specular: 0xffffff,
    })
    console.log("adsf")
  }
}