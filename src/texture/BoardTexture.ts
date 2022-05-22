import { CanvasTexture, NearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter } from "three"
import { boardPadding, indicatorBlocked, indicatorDefault, indicatorOverflow, matrixGap, matrixLineWidth, pieceRadius } from "@util/constants"

const padding = boardPadding * 4
const gap = matrixGap * 4
const lineWidth = matrixLineWidth * 4
const overflow = indicatorOverflow * 4
const radius = pieceRadius * 2
const tagWidth = gap * 0.6

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

    ctx.clearRect(0, 0, this.width, tagWidth * 1.2 + 5)

    ctx.fillStyle = indicatorDefault
    this.drawColumnIndicators()
    this.drawColumnText(-5)
    this.defaultColumnBuffer = ctx.getImageData(0, 0, this.width, tagWidth * 1.2)

    ctx.clearRect(0, 0, this.width, tagWidth * 1.2 + 5)
    
    ctx.fillStyle = indicatorBlocked
    this.drawColumnIndicators()
    this.drawColumnText(-5)
    this.blockedColumnBuffer = ctx.getImageData(0, 0, this.width, tagWidth * 1.2)
  }

  private drawColumnText(end: number) {
    let ctx = this.ctx
    let size = this.size

    ctx.textAlign = "center"
    ctx.font = "38px sans-serif"
    ctx.fillStyle = "#000"
    for (let i = 0; i < size; i++) {
      ctx.fillText(
        String.fromCharCode(65 + i),
        padding + i * gap,
        end + 55
      )
    }
  }

  private drawColumnIndicators() {
    let ctx = this.ctx
    let size = this.size

    for (let i = 0; i < size; i++) {
      let x = padding + i * gap
      ctx.beginPath()
      ctx.moveTo(x, -lineWidth / 2)
      ctx.lineTo(x, -lineWidth / 2)
      ctx.lineTo(x + tagWidth / 2, tagWidth * 0.3)
      ctx.lineTo(x + tagWidth / 2, tagWidth * 1.2)
      ctx.lineTo(x - tagWidth / 2, tagWidth * 1.2)
      ctx.lineTo(x - tagWidth / 2, tagWidth * 0.3)
      ctx.lineTo(x, -lineWidth / 2)
      ctx.fill()
    }
  }

  private redraw(indicatorX?: number, indicatorY?: number, blocked: boolean = false) {
    let ctx = this.ctx
    let size = this.size
    let end = padding + (size - 1) * gap

    ctx.putImageData(this.gridBuffer, 0, 0)

    if (indicatorX !== undefined && indicatorY !== undefined) {
      let x = padding + indicatorX * gap, y = padding + indicatorY * gap;

      ctx.fillStyle = "#0003"
      ctx.beginPath()
      ctx.ellipse(x, y, radius * 2, radius * 2, 0, 0, 2 * Math.PI)
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
        x - tagWidth / 2, 0,
        tagWidth, tagWidth * 1.2
      )

      ctx.beginPath()
      ctx.moveTo(x, padding - overflow)
      ctx.lineTo(x, end + 10)
      ctx.stroke()
    }

    this.needsUpdate = true
  }
}