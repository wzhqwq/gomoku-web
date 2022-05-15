import SlideAnimationClip from "@animation/SlideAnimationClip"
import G from "@util/global"
import { AnimationClip, AnimationMixer, Group, LoopOnce, Object3D, Vector3 } from "three"
import AnimatedComponent from "./AnimatedComponent"
import BaseComponent from "./BaseComponent"
import HidableComponent from "./HidableComponent"
import SizedComponent from "./SizedComponent"
import SlidingComponent from "./SlidingComponent"

export default class BaseGroup extends Group
    implements AnimatedComponent, HidableComponent, SizedComponent, SlidingComponent {
  public animationMixer: AnimationMixer
  public animationEnabled: boolean = true
  public width: number
  public height: number

  private slideAnimationClip: AnimationClip = null
  private slideResolvers: ((value?: void | PromiseLike<void>) => void)[] = []

  private _hidden: boolean = false
  private parentHidden: boolean = false
  
  private slideEnd: Vector3 = null
  private latestSlideEnd: Vector3 = null

  constructor() {
    super()
    this.animationMixer = new AnimationMixer(this)
    G.mixers.set(this.uuid, this.animationMixer)

    this.animationMixer.addEventListener("finished", this.slideAnimationFinishHandler)
  }

  public set hidden(hidden: boolean) {
    if (this._hidden === hidden) return
    this._hidden = hidden
    this.doSetVisibility(this.parentHidden || this._hidden, !this.animationEnabled)
  }

  public setHiddenImmediately(hidden: boolean): void {
    if (this._hidden === hidden) return
    this._hidden = hidden
    this.doSetVisibility(this.parentHidden || this._hidden, true)
  }

  public passVisibility(hidden: boolean, immediately: boolean): void {
    this.parentHidden = hidden
    this.doSetVisibility(this.parentHidden || this._hidden, immediately)
  }

  private doSetVisibility(hidden: boolean, immediately: boolean) {
    this.children.forEach((child: Object3D) => {
      if (!(child instanceof BaseComponent) && !(child instanceof BaseGroup)) return
      child.animationEnabled = this.animationEnabled
      child.passVisibility(hidden, immediately)
    })
  }

  public get hidden(): boolean {
    return this._hidden || this.parentHidden
  }

  public setPositionByAnchor(
    anchor: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center",
    x: number,
    y: number,
    z: number
  ): void {
    switch (anchor) {
      case "center":
        this.position.set(x - this.width / 2, y - this.height / 2, z)
        break
      case "topLeft":
        this.position.set(x, y - this.height, z)
        break
      case "topRight":
        this.position.set(x - this.width, y - this.height, z)
        break
      case "bottomLeft":
        this.position.set(x, y, z)
        break
      case "bottomRight":
        this.position.set(x - this.width, y, z)
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