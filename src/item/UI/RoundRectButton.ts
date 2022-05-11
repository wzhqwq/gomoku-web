import G from "@util/global"
import RoundRectText, { RoundRectTextOptions } from "./RoundRectText"

export type RoundRectButtonOptions = RoundRectTextOptions & {
  onClick?: () => void
}

export default class RoundRectButton extends RoundRectText {
  constructor(options: RoundRectButtonOptions) {
    super(options)
    G.pointerHandlers.set(this.mesh.uuid, {
      target: this,
      callback: (type: string) => {
        if (type === "click") {
          options.onClick?.()
        }
        if (type === "hover") {
          this.mesh.scale.set(1.05, 1.05, 1.05)
        }
        if (type === "leave") {
          this.mesh.scale.set(1, 1, 1)
        }
      }
    })
  }
}