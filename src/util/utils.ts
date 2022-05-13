import { Mesh, Object3D } from "three"
import G from "./global"

export function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  drawRoundRectPath(ctx, x, y, width, height, radius)
  ctx.fill()
}

export function strokeRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  drawRoundRectPath(ctx, x, y, width, height, radius)
  ctx.stroke()
}

export function drawRoundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export function cutText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let ellipsis = '…'
  if (ctx.measureText(text).width <= maxWidth) return text

  let l = 0, r = text.length
  while (l < r) {
    let mid = (l + r + 1) >> 1
    if (ctx.measureText(text.substring(0, mid)).width <= maxWidth) {
      l = mid
    }
    else {
      r = mid - 1
    }
  }
  return text.substring(0, l - 1) + ellipsis
}

export function removeResources(obj: Object3D) {
  obj.traverse(item => {
    if (item instanceof Mesh) {
      let t = item as Mesh
      t.geometry.dispose()
      if (G.mixers.has(t.uuid)) {
        let mixer = G.mixers.get(t.uuid)
        mixer.stopAllAction().uncacheRoot(t)
        G.mixers.delete(t.uuid)
      }
      if (G.pointerHandlers.has(t.uuid)) {
        G.pointerHandlers.delete(t.uuid)
      }
    }
  })
}