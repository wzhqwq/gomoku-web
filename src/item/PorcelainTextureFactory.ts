import { Texture, TextureLoader } from "three"

export default class PorcelainTextureFactory {
  private static instance: Texture

  static create(): Texture {
    if (!this.instance) {
      this.instance = new TextureLoader()
        .load("textures/matcap-porcelain.jpg")
    }
    return this.instance
  }
}