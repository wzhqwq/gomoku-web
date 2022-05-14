import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";

export default class Fonts {
  public hugeFont: Font = null

  public async loadFonts(): Promise<void> {
    let fontLoader = new FontLoader()
    let promises = []
    
    promises.push(new Promise<void>((resolve, reject) => {
      fontLoader.load("font/huge.json", font => {
        this.hugeFont = font
        resolve()
      }, undefined, reject)
    }))

    await Promise.all(promises);
  }
}