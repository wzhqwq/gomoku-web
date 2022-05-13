import BlinkAnimationClip from "@animation/BlinkAnimationClip";
import G from "@util/global";
import { AnimationAction, AnimationMixer, BufferGeometry, LoopOnce, LoopPingPong, Material, Mesh } from "three";
import AnimatedComponent from "./AnimatedComponent";
import BlinkableComponent from "./BlinkableComponent";
import HidableComponent from "./HidableComponent";

export default abstract class BaseComponent extends Mesh
    implements AnimatedComponent, HidableComponent, BlinkableComponent {
  public animationMixer: AnimationMixer
  public width: number
  public height: number

  private _hidden: boolean = false
  private _blinking: boolean = false

  private hideAnimationAction: AnimationAction
  private blinkAnimationAction: AnimationAction
  
  protected buildMesh(): void {
    this.calculateSize()
    this.geometry = this.getGeometry()
    this.material = this.getMaterial()

    console.assert(this.geometry && this.material && this.width && this.height)

    this.animationMixer = new AnimationMixer(this)
    G.mixers.set(this.uuid, this.animationMixer)

    this.hideAnimationAction = this.animationMixer.clipAction(new BlinkAnimationClip(0.3))
    this.hideAnimationAction.setLoop(LoopOnce, 1)
    this.animationMixer.addEventListener("finished", this.hideAnimationFinishHandler)

    this.blinkAnimationAction = this.animationMixer.clipAction(new BlinkAnimationClip(0.6))
    this.blinkAnimationAction.setLoop(LoopPingPong, Infinity)
  }

  protected abstract calculateSize(): void
  protected abstract getMaterial(): Material
  protected abstract getGeometry(): BufferGeometry

  private hideAnimationFinishHandler = (): void => {
    this.hideAnimationAction.paused = true
    this.hideAnimationAction.enabled = true
    this.hideAnimationAction.time = this._hidden ? 0.3 : 0
  }

  public set hidden(value: boolean) {
    this._hidden = value
    this.hideAnimationAction.paused = false
    this.hideAnimationAction.setEffectiveTimeScale(value ? 1 : -1)
    this.hideAnimationAction.play()
    if (!value && this._blinking && !this.blinkAnimationAction.isRunning()) {
      this.blinkAnimationAction.play()
    }
  }

  public get hidden(): boolean {
    return this._hidden
  }

  public set blinking(value: boolean) {
    this._blinking = value
    if (value && !this._hidden) {
      this.blinkAnimationAction.play()
    }
    if (!value && this.blinkAnimationAction.isRunning()) {
      this.blinkAnimationAction.stop()
    }
  }

  public get blinking(): boolean {
    return this._blinking
  }

  public setPositionByAnchor(
    anchor: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center",
    x: number,
    y: number,
    z: number
  ): void {
    switch (anchor) {
      case "center":
        this.position.set(x, y, z)
        break
      case "topLeft":
        this.position.set(x + this.width / 2, y - this.height / 2, z)
        break
      case "topRight":
        this.position.set(x - this.width / 2, y - this.height / 2, z)
        break
      case "bottomLeft":
        this.position.set(x + this.width / 2, y + this.height / 2, z)
        break
      case "bottomRight":
        this.position.set(x - this.width / 2, y + this.height / 2, z)
        break
    }
  }
}