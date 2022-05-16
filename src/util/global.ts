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
import Fonts from "./Fonts"
import RoomInterceptor from "@interceptor/RoomInterceptor"
import ChessBoard from "@item/basic/ChessBoard"
import ControlPanel from "@view/ControlPanel"
import MessageArea from "@view/MessageArea"

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
  private _controlPanel: ControlPanel = null
  private _messageArea: MessageArea = null

  // three.js
  private _matcaps: { [key: string]: Texture } = null
  private _boardFaces: BoardFaceInfo[] = null
  private _chessBoards: ChessBoard[] = null
  public readonly mixers: Map<string, AnimationMixer> = new Map()
  public readonly pointerHandlers: PointerHandlers = new PointerHandlers()

  // 杂项
  
  private _interceptors: Interceptor[] = null
  private _WSClient: WebSocketClient = null
  public readonly fonts: Fonts = new Fonts()

  // 状态
  public setting: Setting = new Setting(
    localStorage.getItem("nickname") || "",
    localStorage.getItem("serverUrl") || "localhost:8989"
  )

  public me: Player = null
  public currentRoom: Room = null
  public myChessType: number = -1

  public get roomController(): RoomController {
    if (this._roomController === null) {
      this._roomController = new RoomController()
    }
    return this._roomController
  }
  public get gameController(): GameController {
    if (this._gameController === null) {
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
  public get controlPanel(): ControlPanel {
    if (this._controlPanel === null) {
      this._controlPanel = new ControlPanel()
    }
    return this._controlPanel
  }
  public get messageArea(): MessageArea {
    if (this._messageArea === null) {
      this._messageArea = new MessageArea()
    }
    return this._messageArea
  }

  public get matcaps(): { [key: string]: Texture } {
    if (this._matcaps === null) {
      let loader = new TextureLoader()
      this._matcaps = {
        "vs": loader.load("textures/matcap-vs.png"),
        "board": loader.load("textures/matcap-board.png"),
        "general": loader.load("textures/matcap-porcelain.jpg"),
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
  public get chessBoards(): ChessBoard[] {
    if (this._chessBoards === null) {
      this._chessBoards = boardStyles.map(({ size, color, positionZ }) => {
        let board = new ChessBoard(size)
        board.position.set(0, 0, positionZ)
        return board
      })
    }
    return this._chessBoards
  }

  public get interceptors(): Interceptor[] {
    if (this._interceptors === null) {
      this._interceptors = [
        new RawInterceptor(),
        new ErrorInterceptor(),
        new RoomInterceptor(),
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