import G from "@util/global";
import { Material, BufferGeometry, MeshBasicMaterial, PlaneBufferGeometry } from "three";
import BaseComponent from "./BaseComponent";

export default class BoardFace extends BaseComponent {
  private static faceGeometry = new PlaneBufferGeometry(120, 120)

  constructor(private size: number) {
    super()
    this.buildMesh()
  }

  protected calculateSize(): void {
    this.width = this.height = 120
  }
  protected getMaterial(): Material {
    let boardFaceTexture = G.boardFaces.find(
      face => face.size === this.size
    ).texture
    return new MeshBasicMaterial({
      map: boardFaceTexture,
      transparent: true
    })
  }
  protected getGeometry(): BufferGeometry {
   return BoardFace.faceGeometry
  }
}