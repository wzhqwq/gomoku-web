import { CanvasTexture } from "three"
import Player from "../model/base/Player"

export default class VersusTexture extends CanvasTexture {
  constructor(player1: Player, player2?: Player) {
    let canvas = document.createElement("canvas")
    canvas.width = 160
    canvas.height = 20
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, 160, 20)

    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#000"
    ctx.fillText(player1.name, 10, 10, 60)

    if (player2) {
      ctx.font = "20px sans-serif"
      ctx.fillStyle = "#ff464f"
      ctx.fillText("VS", 65, 15)

      ctx.font = "16px sans-serif"
      ctx.fillStyle = "#000"
      ctx.fillText(player2.name, 80, 10, 60)
    }
    else {
      ctx.fillText("等待对手", 10, 70)
    }

    super(canvas)
  }
}