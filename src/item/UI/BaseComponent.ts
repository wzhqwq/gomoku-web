import BlinkAnimationClip from "@animation/BlinkAnimationClip";
import G from "@util/global";
import { AnimationAction, AnimationMixer, BufferGeometry, LoopOnce, LoopPingPong, Material, Mesh } from "three";
import AnimatedComponent from "./AnimatedComponent";
import BlinkableComponent from "./BlinkableComponent";
import HidableComponent from "./HidableComponent";
import SizedComponent from "./SizedComponent";

export default abstract class BaseComponent extends Mesh
    implements AnimatedComponent, HidableComponent, BlinkableComponent, SizedComponent {
  public animationMixer: AnimationMixer
  public animationEnabled: boolean = true
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

    this.blinkAnimationAction = this.animationMixer.clipAction(new BlinkAnimationClip(0.8))
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
    if (this._hidden === value) return
    this._hidden = value
    if (this.animationEnabled) {
      this.hideAnimationAction.weight = this._blinking && !value ? 0 : 1
      this.blinkAnimationAction.weight = value ? 0 : 1
      this.hideAnimationAction.paused = false
      this.hideAnimationAction.setEffectiveTimeScale(value ? 1 : -1)
      this.hideAnimationAction.play()
    }
    else {
      this.hideAnimationFinishHandler()
    }
    if (!value && this._blinking && !this.blinkAnimationAction.isRunning()) {
      this.blinkAnimationAction.play()
      this.hideAnimationAction.weight = 0
    }
    if (this._blinking && !value) {
      this.blinkAnimationAction.time = 0.8
    }
  }

  public get hidden(): boolean {
    return this._hidden
  }

  public set blinking(value: boolean) {
    if (this._blinking === value) return
    this._blinking = value
    if (value && !this._hidden && this.animationEnabled) {
      this.blinkAnimationAction.play()
      this.hideAnimationAction.weight = 0
      this.blinkAnimationAction.weight = 1
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