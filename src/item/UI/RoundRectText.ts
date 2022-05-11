import { CanvasTexture, Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three"
import { cutText, fillRoundRect, strokeRoundRect } from "../../util/utils"

export type RoundRectTextOptions = {
  content: string
  size?: number
  color?: string
  bgColor?: string
  variant?: "filled" | "outlined"
  minWidth?: number
  exactWidth?: number
}

export default class RoundRectText extends Group {
  public readonly width: number
  public readonly height: number

  public readonly mesh: Mesh

  constructor({
    content,
    size = 14,
    color = '#fff',
    bgColor = '#222',
    variant = 'filled',
    minWidth = Infinity,
    exactWidth = null,
  }: RoundRectTextOptions) {
    super()

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.font = `${size}px sans-serif`
    content = cutText(ctx, content, Math.min(exactWidth ?? Infinity, minWidth) - 20)
    const {
      width,
      actualBoundingBoxAscent,
      actualBoundingBoxDescent
    } = ctx.measureText(content)
    this.width = canvas.width = exactWidth ?? (width + 20)
    this.height = canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent + 20

    switch (variant) {
      case 'filled':
        ctx.fillStyle = bgColor
        fillRoundRect(ctx, 0, 0, canvas.width, canvas.height, 12)
        break
      case 'outlined':
        ctx.strokeStyle = bgColor
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        strokeRoundRect(ctx, 2, 2, canvas.width - 4, canvas.height - 4, 12)
        break
    }
    ctx.fillStyle = color
    ctx.font = `${size}px sans-serif`
    ctx.fillText(content, exactWidth ? (exactWidth - width) / 2 : 10, actualBoundingBoxAscent + 10)

    const texture = new CanvasTexture(canvas)
    const rect = new PlaneBufferGeometry(this.width, this.height)
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    this.mesh = new Mesh(rect, material)
    this.mesh.position.set(this.width / 2, this.height / 2, 0)
    this.add(this.mesh)
  }
}
