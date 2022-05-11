import { AnimationMixer, Texture, TextureLoader } from "three"
import GameController from "@controller/GameController"
import BoardInfoTexture from "@texture/BoardInfoTexture"
import Player from "@model/base/Player"
import Setting from "@model/local/Setting"
import Stage from "@view/Stage"
import PointerHandlers from "./pointerHandlers"
import NewRoom from "@view/NewRoom"
import UserInput from "@view/UserInput"
import Room from "@model/base/Room"
import RoomController from "@controller/RoomController"

type BoardFaceInfo = {
  size: number
  texture: BoardInfoTexture
}

// 实现简易的单例工厂
class Global {
  //controllers
  private _roomController: RoomController = null
  private _gameController: GameController = null

  // views
  private _stage: Stage = null
  private _newRoom: NewRoom = null
  private _userInput: UserInput = null

  // three.js
  private _matcaps: { [key: string]: Texture } = null
  private _boardFaces: BoardFaceInfo[] = null
  public mixers: Map<string, AnimationMixer> = new Map()
  public pointerHandlers: PointerHandlers = new PointerHandlers()
  
  // 状态
  public setting: Setting = new Setting(
    localStorage.getItem("nickname") || "",
    localStorage.getItem("serverUrl") || "localhost:8989"
  )

  public me: Player = null
  public currentRoom: Room = null

  public get roomController(): RoomController {
    if (this._roomController === null) {
      this._roomController = new RoomController()
    }
    return this._roomController
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
  public get newRoom(): NewRoom {
    if (this._newRoom === null) {
      this._newRoom = new NewRoom()
    }
    return this._newRoom
  }
  public get userInput(): UserInput {
    if (this._userInput === null) {
      this._userInput = new UserInput()
    }
    return this._userInput
  }

  public get matcaps(): { [key: string]: Texture } {
    if (this._matcaps === null) {
      let loader = new TextureLoader()
      this._matcaps = {
        "vs": loader.load("textures/matcap-vs.png"),
      }
    }
    return this._matcaps
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