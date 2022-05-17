import DropAnimationClip from "@animation/DropAnimationClip";
import { pieceRadius } from "@util/constants";
import G from "@util/global";
import { AnimationAction, AnimationMixer, LatheGeometry, LoopOnce, Mesh, MeshMatcapMaterial, Shape, Vector3 } from "three";

export default class Piece extends Mesh {
  private animationMixer: AnimationMixer
  private dropAnimationAction: AnimationAction

  constructor(color: number, private endPoint: Vector3) {
    super()
    let material = new MeshMatcapMaterial({
      matcap: G.matcaps.general,
      color
    })
    let borderShape = new Shape()
    borderShape.bezierCurveTo(pieceRadius * 0.6, 0, pieceRadius, 0, pieceRadius, pieceRadius * 0.2)
    borderShape.bezierCurveTo(pieceRadius, pieceRadius * 0.5, pieceRadius * 0.3, pieceRadius * 0.6, 0, pieceRadius * 0.6)
    let geometry = new LatheGeometry(borderShape.getPoints(10), 20)

    this.geometry = geometry
    this.material = material

    this.rotateX(Math.PI / 2)

    this.animationMixer = new AnimationMixer(this)
    G.mixers.set(this.uuid, this.animationMixer)
    this.animationMixer.addEventListener("finished", this.handleAnimationFinish)
    
    this.dropAnimationAction = this.animationMixer.clipAction(
      new DropAnimationClip(0.5, endPoint)
    )
    this.dropAnimationAction.setLoop(LoopOnce, 1)
  }

  public drop() {
    this.dropAnimationAction.reset()
    this.dropAnimationAction.play()
  }

  private handleAnimationFinish() {
    this.position.copy(this.endPoint)
  }
}