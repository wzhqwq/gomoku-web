import { CanvasTexture } from "three"
import { boardPadding, indicatorOverflow, matrixGap, matrixLineWidth } from "@util/constants"

const padding = boardPadding * 2, gap = matrixGap * 2, lineWidth = matrixLineWidth, overflow = indicatorOverflow * 2;

export default class BoardTexture extends CanvasTexture {
  private ctx: CanvasRenderingContext2D
  private width: number

  constructor(private size: number) {
    let canvas = document.createElement("canvas")
    canvas.width = canvas.height = (size - 1) * gap + 2 * padding
    super(canvas)

    this.ctx = canvas.getContext("2d")
    this.width = canvas.width
    this.redraw()
  }

  public drawIndicator(x: number, y: number) {
    this.redraw(x, y)
  }

  private redraw(indicatorX?: number, indicatorY?: number) {
    let ctx = this.ctx
    let size = this.size

    ctx.clearRect(0, 0, this.width, this.width)

    ctx.lineCap = "round"

    let end = padding + (size - 1) * gap

    ctx.lineWidth = lineWidth
    ctx.strokeStyle = "#000"
    for (let i = 0; i < size; i++) {
      if (indicatorX !== i) {
        ctx.beginPath()
        ctx.moveTo(padding + i * gap, padding)
        ctx.lineTo(padding + i * gap, end)
        ctx.stroke()
      }

      if (indicatorY !== i) {
        ctx.beginPath()
        ctx.moveTo(padding, padding + i * gap)
        ctx.lineTo(end, padding + i * gap)
        ctx.stroke()
      }
    }
    ctx.lineWidth = lineWidth * 2
    ctx.strokeStyle = "#56ffd6"
    ctx.beginPath()
    ctx.moveTo(padding + indicatorX * gap, padding - overflow)
    ctx.lineTo(padding + indicatorX * gap, end + 10)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(padding - overflow, padding + indicatorY * gap)
    ctx.lineTo(end + overflow, padding + indicatorY * gap)
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.font = "22px sans-serif"
    for (let i = 0; i < size; i++) {
      if (indicatorX === i) {
        ctx.fillStyle = "#56ffd6"
        ctx.beginPath()
        ctx.moveTo(padding + i * gap, end + 5 + lineWidth / 2)
        ctx.lineTo(padding + i * gap, end + 5 + lineWidth / 2)
        ctx.lineTo(padding + i * gap + 16, end + 15)
        ctx.lineTo(padding + i * gap + 16, end + 40)
        ctx.lineTo(padding + i * gap - 16, end + 40)
        ctx.lineTo(padding + i * gap - 16, end + 15)
        ctx.lineTo(padding + i * gap, end + 5 + lineWidth / 2)
        ctx.fill()
      }
      ctx.fillStyle = "#000"
      ctx.fillText(
        String.fromCharCode(65 + i),
        padding + i * gap,
        end + 34
      )
    }
  }
}