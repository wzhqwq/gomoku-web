import BlinkAnimationClip from "@animation/BlinkAnimationClip";
import SlideAnimationClip from "@animation/SlideAnimationClip";
import G from "@util/global";
import { AnimationAction, AnimationClip, AnimationMixer, BufferGeometry, LoopOnce, LoopPingPong, Material, Mesh, MeshMatcapMaterial, Vector3 } from "three";
import AnimatedComponent from "./AnimatedComponent";
import BlinkableComponent from "./BlinkableComponent";
import HidableComponent from "./HidableComponent";
import SizedComponent from "./SizedComponent";
import SlidingComponent from "./SlidingComponent";

export default abstract class BaseComponent extends Mesh
    implements AnimatedComponent, HidableComponent, BlinkableComponent, SizedComponent, SlidingComponent {
  public animationMixer: AnimationMixer
  public animationEnabled: boolean = true
  public width: number
  public height: number

  private _hidden: boolean = false
  private parentHidden: boolean = false
  private _blinking: boolean = false

  private hideAnimationAction: AnimationAction
  private blinkAnimationAction: AnimationAction

  private slideAnimationClip: AnimationClip = null
  private slideResolvers: ((value?: void | PromiseLike<void>) => void)[] = []

  private slideEnd: Vector3 = null
  private latestSlideEnd: Vector3 = null
  
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
    this.animationMixer.addEventListener("finished", this.slideAnimationFinishHandler)

    this.blinkAnimationAction = this.animationMixer.clipAction(new BlinkAnimationClip(0.8))
    this.blinkAnimationAction.setLoop(LoopPingPong, Infinity)
  }

  protected abstract calculateSize(): void
  protected abstract getMaterial(): Material
  protected abstract getGeometry(): BufferGeometry

  private hideAnimationFinishHandler = (): void => {
    this.hideAnimationAction.paused = true
    this.hideAnimationAction.enabled = true
    this.hideAnimationAction.time = this.hidden ? 0.3 : 0
  }

  public set hidden(value: boolean) {
    if (this._hidden === value) return
    this._hidden = value
    this.doSetVisibility(value, !this.animationEnabled)
  }

  public setHiddenImmediately(value: boolean): void {
    if (this._hidden === value) return
    this._hidden = value
    this.doSetVisibility(value, true)
  }

  public passVisibility(hidden: boolean, immediately: boolean): void {
    this.parentHidden = hidden
    this.doSetVisibility(this.parentHidden || this._hidden, immediately)
  }

  private doSetVisibility(hidden: boolean, immediately: boolean) {
    this.hideAnimationAction.weight = this._blinking && !hidden ? 0 : 1
    this.blinkAnimationAction.weight = hidden ? 0 : 1
    this.hideAnimationAction.paused = false
    this.hideAnimationAction.setEffectiveTimeScale(hidden ? 1 : -1)
    this.hideAnimationAction.play()
    if (immediately) {
      this.hideAnimationFinishHandler()
    }
    if (!hidden && this._blinking && !this.blinkAnimationAction.isRunning()) {
      this.blinkAnimationAction.play()
      this.hideAnimationAction.weight = 0
    }
    if (this._blinking && !hidden) {
      this.blinkAnimationAction.time = 0.8
    }
  }

  public get hidden(): boolean {
    return this._hidden || this.parentHidden
  }

  public set blinking(value: boolean) {
    if (this._blinking === value) return
    this._blinking = value
    if (value && !this.hidden && this.animationEnabled) {
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

  public slideTo(x: number, y: number, z: number): Promise<void> {
    let end = new Vector3(x, y, z)
    if (!this.slideAnimationClip) {
      if (this.position.equals(end)) return Promise.resolve()
      this.slideEnd = end
      this.doSlide()
    }
    else {
      this.latestSlideEnd = end
    }
    
    return new Promise(res => {
      this.slideResolvers.push(res)
    })
  }

  public dispose() {
    G.mixers.delete(this.uuid)
    G.pointerHandlers.delete(this.uuid)
    this.animationMixer.removeEventListener("finished", this.hideAnimationFinishHandler)
    if (this.material instanceof Array) {
      this.material.forEach(m => m.dispose())
    }
    else {
      this.material.dispose()
    }
  }

  private doSlide() {
    this.latestSlideEnd = null
    this.slideAnimationClip = new SlideAnimationClip(0.5, this.position, this.slideEnd)
    let animationAction = this.animationMixer.clipAction(this.slideAnimationClip)
    animationAction.setLoop(LoopOnce, 1)
    animationAction.play()
  }

  private slideAnimationFinishHandler = (): void => {
    if (!this.slideAnimationClip) return
    this.animationMixer.uncacheClip(this.slideAnimationClip)
    this.slideAnimationClip = null
    this.position.copy(this.slideEnd)
    if (this.latestSlideEnd) {
      this.slideEnd = this.latestSlideEnd
      this.doSlide()
    }
    this.slideResolvers.forEach(res => res())
  }
}