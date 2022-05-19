import { CanvasTexture } from "three"
import { boardPadding, indicatorBlocked, indicatorDefault, indicatorOverflow, matrixGap, matrixLineWidth, pieceRadius } from "@util/constants"

const padding = boardPadding * 2, gap = matrixGap * 2, lineWidth = matrixLineWidth, overflow = indicatorOverflow * 2;

export default class BoardTexture extends CanvasTexture {
  private ctx: CanvasRenderingContext2D
  private width: number
  private gridBuffer: ImageData
  private defaultColumnBuffer: ImageData
  private blockedColumnBuffer: ImageData

  constructor(private size: number) {
    let canvas = document.createElement("canvas")
    canvas.width = canvas.height = (size - 1) * gap + 2 * padding
    super(canvas)

    this.ctx = canvas.getContext("2d")
    this.width = canvas.width
    this.generateGridBuffer()
    this.generateColumnBuffer()
    this.redraw()
  }

  public drawIndicator(x: number, y: number, blocked?: boolean) {
    this.redraw(x, y, blocked)
  }

  public clearIndicator() {
    this.redraw()
  }

  private generateGridBuffer() {
    let ctx = this.ctx
    let size = this.size
    let end = padding + (size - 1) * gap

    ctx.lineCap = "round"
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = "#000"
    for (let i = 0; i < size; i++) {
      ctx.beginPath()
      ctx.moveTo(padding + i * gap, padding)
      ctx.lineTo(padding + i * gap, end)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(padding, padding + i * gap)
      ctx.lineTo(end, padding + i * gap)
      ctx.stroke()
    }

    this.drawColumnText(end)

    this.gridBuffer = ctx.getImageData(0, 0, this.width, this.width)
  }

  private generateColumnBuffer() {
    let ctx = this.ctx

    ctx.clearRect(0, 0, this.width, 45)

    ctx.fillStyle = indicatorDefault
    this.drawColumnIndicators()
    this.drawColumnText(-5)
    this.defaultColumnBuffer = ctx.getImageData(0, 0, this.width, 40)

    ctx.clearRect(0, 0, this.width, 45)
    
    ctx.fillStyle = indicatorBlocked
    this.drawColumnIndicators()
    this.drawColumnText(-5)
    this.blockedColumnBuffer = ctx.getImageData(0, 0, this.width, 40)
  }

  private drawColumnText(end: number) {
    let ctx = this.ctx
    let size = this.size

    ctx.textAlign = "center"
    ctx.font = "22px sans-serif"
    ctx.fillStyle = "#000"
    for (let i = 0; i < size; i++) {
      ctx.fillText(
        String.fromCharCode(65 + i),
        padding + i * gap,
        end + 34
      )
    }
  }

  private drawColumnIndicators() {
    let ctx = this.ctx
    let size = this.size

    for (let i = 0; i < size; i++) {
      let x = padding + i * gap
      ctx.beginPath()
      ctx.moveTo(x, lineWidth / 2)
      ctx.lineTo(x, lineWidth / 2)
      ctx.lineTo(x + 16, 10)
      ctx.lineTo(x + 16, 40)
      ctx.lineTo(x - 16, 40)
      ctx.lineTo(x - 16, 10)
      ctx.lineTo(x, lineWidth / 2)
      ctx.fill()
    }
  }

  private redraw(indicatorX?: number, indicatorY?: number, blocked: boolean = false) {
    console.log("redraw", indicatorX, Date.now())
    let ctx = this.ctx
    let size = this.size
    let end = padding + (size - 1) * gap

    ctx.putImageData(this.gridBuffer, 0, 0)

    if (indicatorX !== undefined && indicatorY !== undefined) {
      let x = padding + indicatorX * gap, y = padding + indicatorY * gap;

      ctx.fillStyle = "#0003"
      ctx.beginPath()
      ctx.ellipse(x, y, pieceRadius * 2, pieceRadius * 2, 0, 0, 2 * Math.PI)
      ctx.fill()

      ctx.lineCap = "round"
      ctx.strokeStyle = blocked ? indicatorBlocked : indicatorDefault
      ctx.lineWidth = lineWidth * 2

      ctx.beginPath()
      ctx.moveTo(padding - overflow, y)
      ctx.lineTo(end + overflow, y)
      ctx.stroke()

      ctx.putImageData(
        blocked ? this.blockedColumnBuffer : this.defaultColumnBuffer,
        0, end + 5,
        x - 16, 0,
        32, 40
      )

      ctx.beginPath()
      ctx.moveTo(x, padding - overflow)
      ctx.lineTo(x, end + 10)
      ctx.stroke()
    }

    this.needsUpdate = true
  }
}