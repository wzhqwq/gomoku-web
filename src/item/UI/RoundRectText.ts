import BlinkAnimationClip from "@animation/BlinkAnimationClip"
import { AnimationAction, AnimationMixer, BufferGeometry, CanvasTexture, Group, LoopOnce, Material, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three"
import { cutText, fillRoundRect, strokeRoundRect } from "../../util/utils"
import AnimatedComponent from "./AnimatedComponent"
import BaseComponent from "./BaseComponent"

export type RoundRectTextOptions = {
  content: string
  size?: number
  color?: string
  bgColor?: string
  variant?: "filled" | "outlined"
  minWidth?: number
  exactWidth?: number
}

export default class RoundRectText extends BaseComponent {
  public width: number
  public height: number

  public readonly mesh: Mesh
  public readonly animationMixer: AnimationMixer

  private options: RoundRectTextOptions
  private canvas: HTMLCanvasElement
  private textPos: { x: number, y: number }

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

    this.options = { content, size, color, bgColor, variant, minWidth, exactWidth }
    this.canvas = document.createElement('canvas')

    this.buildMesh();
  }

  protected calculateSize(): void {
    const { size, exactWidth, minWidth } = this.options
    const ctx = this.canvas.getContext('2d')

    ctx.font = `${size}px sans-serif`

    let content = cutText(ctx, this.options.content, Math.min(exactWidth ?? Infinity, minWidth) - 20)
    const {
      width,
      actualBoundingBoxAscent,
      actualBoundingBoxDescent
    } = ctx.measureText(content)

    this.width = this.canvas.width = exactWidth ?? (width + 20)
    this.height = this.canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent + 20
    this.textPos = {
      x: exactWidth ? (exactWidth - width) / 2 : 10,
      y: actualBoundingBoxAscent + 10
    }
  }

  protected getMaterial(): Material {
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
    return new MeshBasicMaterial({
      map: texture,
      transparent: true
    })
  }
  
  protected getGeometry(): BufferGeometry {
    return new PlaneBufferGeometry(this.width, this.height)
  }
}
