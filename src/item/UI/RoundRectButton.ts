import ScaleAnimationClip from "@animation/ScaleAnimationClip"
import G from "@util/global"
import { AnimationMixer, LoopOnce } from "three"
import RoundRectText, { RoundRectTextOptions } from "./RoundRectText"

export type RoundRectButtonOptions = RoundRectTextOptions & {
  onClick?: () => void
}

export default class RoundRectButton extends RoundRectText {
  private hovered: boolean = false

  constructor(options: RoundRectButtonOptions) {
    super(options)
    let hoverAnimationAction = this.animationMixer.clipAction(new ScaleAnimationClip(0.2))
    hoverAnimationAction.setLoop(LoopOnce, 1)
    G.mixers.set(this.uuid, this.animationMixer)
    this.animationMixer.addEventListener("finished", () => {
      hoverAnimationAction.paused = true
      hoverAnimationAction.enabled = true
      hoverAnimationAction.time = this.hovered ? 0.2 : 0
    })

    G.pointerHandlers.set(this.uuid, {
      target: this,
      callback: (type: string) => {
        if (type === "click") {
          options.onClick?.()
        }
        else {
          this.hovered = type === "hover"
          hoverAnimationAction.paused = false
          hoverAnimationAction.setEffectiveTimeScale(this.hovered ? 1 : -1)
          hoverAnimationAction.play()
          window.document.body.style.cursor = this.hovered ? "pointer" : "default"
        }
      }
    })
  }
}