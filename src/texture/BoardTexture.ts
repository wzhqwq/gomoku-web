import { CanvasTexture } from "three"
import { fillRoundRect } from "@util/utils"
import { boardPadding, matrixGap, matrixLineWidth } from "@util/constants"

const padding = boardPadding * 2, gap = matrixGap * 2, lineWidth = matrixLineWidth;

export default class BoardTexture extends CanvasTexture {
  constructor(size: number, indicatorX?: number, indicatorY?: number) {
    let canvas = document.createElement("canvas")
    canvas.width = canvas.height = (size - 1) * gap + 2 * padding
    let ctx = canvas.getContext("2d")

    for (let i = 0; i < size; i++) {
      ctx.lineWidth = indicatorX === i ? matrixLineWidth * 2 : matrixLineWidth
      ctx.strokeStyle = indicatorX === i ? "#e70055" : "#000"
      ctx.beginPath()
      ctx.moveTo(padding, padding + i * gap)
      ctx.lineTo(padding + (size - 1) * gap, padding + i * gap)
      ctx.stroke()

      ctx.lineWidth = indicatorY === i ? matrixLineWidth * 2 : matrixLineWidth
      ctx.strokeStyle = indicatorY === i ? "#e70055" : "#000"
      ctx.beginPath()
      ctx.moveTo(padding + i * gap, padding)
      ctx.lineTo(padding + i * gap, padding + (size - 1) * gap)
      ctx.stroke()
    }

    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.font = "18px sans-serif"
    for (let i = 0; i < size; i++) {
      ctx.fillText(
        String.fromCharCode(65 + i),
        padding + i * gap,
        padding + (size - 1) * gap + 24
      )
    }

    super(canvas)
  }
}