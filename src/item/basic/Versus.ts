import BaseComponent from "@item/UI/BaseComponent"
import G from "@util/global"
import { BufferGeometry, Material, MeshMatcapMaterial } from "three"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

export default class Versus extends BaseComponent {
  private static cachedGeometry: TextGeometry
  private static cachedMaterial: MeshMatcapMaterial

  constructor() {
    super()
    if (!Versus.cachedGeometry) {
      Versus.cachedGeometry = new TextGeometry("VS", {
        font: G.fonts.hugeFont,
        size: 18,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 0,
      })
    }
    if (!Versus.cachedMaterial) {
      Versus.cachedMaterial = new MeshMatcapMaterial({
        matcap: G.matcaps.vs,
        transparent: true,
      })
    }

    this.buildMesh()
  }

  protected calculateSize(): void {
    this.width = 40
    this.height = 24
  }

  protected getMaterial(): Material {
    return Versus.cachedMaterial
  }

  protected getGeometry(): BufferGeometry {
    return Versus.cachedGeometry
  }
}