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
  public animationEnabled: boolean
  public width: number
  public height: number

  private slideAnimationClip: AnimationClip = null
  private slideResolver: (value?: void | PromiseLike<void>) => void

  private _hidden: boolean = false
  
  private slideEnd: Vector3

  constructor() {
    super()
    this.animationMixer = new AnimationMixer(this)
    G.mixers.set(this.uuid, this.animationMixer)

    this.animationMixer.addEventListener("finished", this.slideAnimationFinishHandler)
  }

  public set hidden(hidden: boolean) {
    if (this._hidden === hidden) return
    this._hidden = hidden
    this.children.forEach((child: Object3D) => {
      if (!(child instanceof BaseComponent) && !(child instanceof BaseGroup)) return
      child.animationEnabled = this.animationEnabled
      child.hidden = hidden
    })
  }

  public get hidden(): boolean {
    return this._hidden
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
    this.slideEnd = new Vector3(x, y, z)
    this.slideAnimationClip = new SlideAnimationClip(0.5, this.position, this.slideEnd)
    let animationAction = this.animationMixer.clipAction(this.slideAnimationClip)
    animationAction.setLoop(LoopOnce, 1)
    animationAction.play()
    return new Promise(res => {
      this.slideResolver = res
    })
  }

  private slideAnimationFinishHandler = (): void => {
    if (!this.slideAnimationClip) return
    this.animationMixer.uncacheClip(this.slideAnimationClip)
    this.slideAnimationClip = null
    this.slideResolver()
    this.position.copy(this.slideEnd)
  }
}