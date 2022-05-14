import G from "@util/global"
import { Mesh, MeshMatcapMaterial } from "three"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

export default class Versus extends Mesh {
  private static cachedGeometry: TextGeometry
  private static cachedMaterial: MeshMatcapMaterial

  constructor() {
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
      })
    }
    super(Versus.cachedGeometry, Versus.cachedMaterial)
  }
}