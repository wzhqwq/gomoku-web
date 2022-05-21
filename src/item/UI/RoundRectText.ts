import { AnimationMixer, BufferGeometry, CanvasTexture, Group, LoopOnce, Material, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three"
import { cutText, fillRoundRect, strokeRoundRect } from "../../util/utils"
import BaseComponent from "./BaseComponent"
import * as md5 from "md5"

export type RoundRectTextOptions = {
  content: string
  size?: number
  color?: string
  bgColor?: string
  variant?: "filled" | "outlined"
  maxWidth?: number
  exactWidth?: number
}

export default class RoundRectText extends BaseComponent {
  private options: RoundRectTextOptions
  private canvas: HTMLCanvasElement
  private textPos: { x: number, y: number }

  private static materialCache: Map<string, Material> = new Map()
  private cachedMaterial: Material | null = null

  constructor({
    content,
    size = 14,
    color = '#fff',
    bgColor = '#222',
    variant = 'filled',
    maxWidth = Infinity,
    exactWidth = null,
  }: RoundRectTextOptions) {
    super()

    this.options = { content, size, color, bgColor, variant, maxWidth, exactWidth }
    this.cachedMaterial = RoundRectText.materialCache.get(md5(JSON.stringify(this.options)))
    this.canvas = document.createElement('canvas')

    this.buildMesh()

    this.canvas = null
  }

  protected calculateSize(): void {
    const { size, exactWidth, maxWidth } = this.options
    const ctx = this.canvas.getContext('2d')

    ctx.font = `${size}px sans-serif`

    let content = cutText(ctx, this.options.content, Math.min(exactWidth ?? Infinity, maxWidth) - 20)
    const {
      width,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(content)

    this.width = this.canvas.width = exactWidth ?? (width + 20)
    this.height = this.canvas.height = fontBoundingBoxAscent + fontBoundingBoxDescent + 12
    this.textPos = {
      x: exactWidth ? (exactWidth - width) / 2 : 10,
      y: fontBoundingBoxAscent + 6
    }
  }

  protected getMaterial(): Material {
    if (this.cachedMaterial) return this.cachedMaterial.clone()
    const { content, size, color, bgColor, variant } = this.options
    const ctx = this.canvas.getContext('2d')

    switch (variant) {
      case 'filled':
        ctx.fillStyle = bgColor
        fillRoundRect(ctx, 0, 0, this.width, this.height, 12)
        break
      case 'outlined':
        ctx.strokeStyle = bgColor
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        strokeRoundRect(ctx, 2, 2, this.width - 4, this.height - 4, 12)
        break
    }
    ctx.fillStyle = color
    ctx.font = `${size}px sans-serif`
    ctx.fillText(content, this.textPos.x, this.textPos.y)

    const texture = new CanvasTexture(this.canvas)
    texture.needsUpdate = false
    let material = new MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    RoundRectText.materialCache.set(md5(JSON.stringify(this.options)), material)
    return material
  }
  
  protected getGeometry(): BufferGeometry {
    return new PlaneBufferGeometry(this.width, this.height)
  }
}
