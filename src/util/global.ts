import { AnimationMixer, Texture, TextureLoader } from "three"
import GameController from "@controller/GameController"
import BoardInfoTexture from "@texture/BoardInfoTexture"
import Player from "@model/base/Player"
import Setting from "@model/local/Setting"
import ThreeJsStage from "@view/ThreeJsStage"
import PointerHandlers from "./pointerHandlers"
import NewRoom from "@view/NewRoom"
import UserInput from "@view/UserInput"
import Room from "@model/base/Room"
import RoomController from "@controller/RoomController"
import AbstractStage from "@view/AbstractStage"
import Interceptor from "@interceptor/Interceptor"
import ErrorInterceptor from "@interceptor/ErrorInterceptor"
import RawInterceptor from "@interceptor/RawInterceptor"
import ChessboardInterceptor from "@interceptor/ChessBoardInterceptor"
import WebSocketClient from "./WebSocketClient"
import { boardStyles } from "./constants"

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
  private _stage: AbstractStage = null
  private _newRoom: NewRoom = null
  private _userInput: UserInput = null

  // three.js
  private _matcaps: { [key: string]: Texture } = null
  private _boardFaces: BoardFaceInfo[] = null
  public mixers: Map<string, AnimationMixer> = new Map()
  public pointerHandlers: PointerHandlers = new PointerHandlers()
  
  private _interceptors: Interceptor[] = null
  private _WSClient: WebSocketClient = null

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

  public get stage(): AbstractStage {
    if (this._stage === null) {
      this._stage = new ThreeJsStage()
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
      this._boardFaces = boardStyles.map(({ size, color }) => ({
        size,
        texture: new BoardInfoTexture(size, color)
      }))
    }
    return this._boardFaces
  }

  public get interceptors(): Interceptor[] {
    if (this._interceptors === null) {
      this._interceptors = [
        new RawInterceptor(),
        new ErrorInterceptor(),
        new ChessboardInterceptor(),
      ]
    }
    return this._interceptors
  }

  public get WSClient(): WebSocketClient {
    if (this._WSClient === null) {
      this._WSClient = new WebSocketClient()
    }
    return this._WSClient
  }
}

const G = new Global()
export default G