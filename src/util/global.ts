import { AnimationMixer, Object3D, Texture, TextureLoader } from "three"
import GameController from "../controller/GameController"
import BoardInfoTexture from "../item/BoardInfoTexture"
import Setting from "../model/local/Setting"
import Stage from "../view/Stage"
import PointerHandlers from "./pointerHandlers"

type BoardFaceInfo = {
  size: number
  texture: BoardInfoTexture
}

// 实现简易的单例工厂
class Global {
  private _gameController: GameController = null
  private _stage: Stage = null
  private _boardFaces: BoardFaceInfo[] = null

  public matcaps: { [key: string]: Texture }
  
  public setting: Setting = new Setting(
    localStorage.getItem("nickname") || "",
    localStorage.getItem("serverUrl") || "localhost:8989"
  )

  public mixers: Map<string, AnimationMixer> = new Map()
  public pointerHandlers: PointerHandlers = new PointerHandlers()

  constructor() {
    let loader = new TextureLoader()
    this.matcaps = {
      "vs": loader.load("textures/matcap-vs.png"),
    }
  }

  public get gameController(): GameController {
    if (this.gameController === null) {
      this._gameController = new GameController()
    }
    return this._gameController
  }
  public get stage(): Stage {
    if (this._stage === null) {
      this._stage = new Stage()
    }
    return this._stage
  }
  public get boardFaces(): BoardFaceInfo[] {
    if (this._boardFaces === null) {
      this._boardFaces = [
        {
          size: 10,
          color: "#0077cb"
        }, {
          size: 15,
          color: "#af7900"
        }, {
          size: 20,
          color: "#cb002f"
        }
      ].map(({ size, color }) => ({
        size,
        texture: new BoardInfoTexture(size, color)
      }))
    }
    return this._boardFaces
  }
}

const G = new Global()
export default G