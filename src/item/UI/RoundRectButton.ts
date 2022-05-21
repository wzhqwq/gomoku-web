import ScaleAnimationClip from "@animation/ScaleAnimationClip"
import G from "@util/global"
import { AnimationAction, AnimationMixer, LoopOnce } from "three"
import RoundRectText, { RoundRectTextOptions } from "./RoundRectText"

export type RoundRectButtonOptions = RoundRectTextOptions & {
  onClick?: () => void
}

export default class RoundRectButton extends RoundRectText {
  private hovered: boolean = false
  private hoverAnimationAction: AnimationAction

  constructor(options: RoundRectButtonOptions) {
    super(options)
    this.hoverAnimationAction = this.animationMixer.clipAction(new ScaleAnimationClip(0.2))
    this.hoverAnimationAction.setLoop(LoopOnce, 1)
    this.animationMixer.addEventListener("finished", this.handleHoverAnimationFinish)

    G.pointerHandlers.set(this.uuid, {
      target: this,
      callback: (type: string) => {
        if (type === "move") return
        if (type === "click") {
          options.onClick?.()
        }
        else {
          this.hovered = type === "hover"
          this.hoverAnimationAction.paused = false
          this.hoverAnimationAction.setEffectiveTimeScale(this.hovered ? 1 : -1)
          this.hoverAnimationAction.play()
          window.document.body.style.cursor = this.hovered && !this.hidden ? "pointer" : "default"
        }
      }
    })
  }

  private handleHoverAnimationFinish = () => {
    this.hoverAnimationAction.paused = true
    this.hoverAnimationAction.enabled = true
    this.hoverAnimationAction.time = this.hovered ? 0.2 : 0
  }

  public dispose() {
    super.dispose()
    this.animationMixer.removeEventListener("finished", this.handleHoverAnimationFinish)
  }
}