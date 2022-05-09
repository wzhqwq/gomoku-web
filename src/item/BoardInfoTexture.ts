import { CanvasTexture } from "three"
import { fillRoundRect } from "../util/utils"

export default class BoardInfoTexture extends CanvasTexture {
  constructor(size: number, color: string) {
    let canvas = document.createElement("canvas")
    canvas.width = canvas.height = 100
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    fillRoundRect(ctx, 0, 0, 100, 100, 10)

    ctx.strokeStyle = "#000"
    for (let i = 0; i < 100; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(100, i)
      ctx.stroke()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 100)
      ctx.stroke()
    }
    ctx.fillRect(6, 38, 88, 30)

    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.font = "bold 24px sans-serif"
    ctx.fillText(`${size}×${size}`, 50, 62)

    super(canvas)
  }
}