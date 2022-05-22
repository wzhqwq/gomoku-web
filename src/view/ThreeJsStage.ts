import * as $ from "jquery"
import { AmbientLight, AnimationAction, AnimationMixer, Clock, LoopOnce, PerspectiveCamera, Raycaster, Renderer, Scene, Vector2, Vector3, WebGLRenderer } from "three"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import RoomList from "@item/grouped/RoomList"
import Room from "@model/base/Room"
import eventDispatcher from "@event/eventDispatcher"
import G from "@util/global"
import { CreateRoomEvent, FetchRoomEvent } from "@event/emptyEvents"
import Stage from "./AbstractStage"
import ChessBoard from "@item/basic/ChessBoard"
import { blackPieceColor, boardStyles, matrixGap, whitePieceColor } from "@util/constants"
import SlideAnimationClip, { SlideTrack } from "@animation/SlideAnimationClip"
import Piece from "@item/basic/Piece"
import Chess from "@model/base/Chess"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"

export default class ThreeJsStage implements Stage {
  // DOM
  private roomTitle: JQuery<HTMLDivElement>
  
  private roomRefreshButton: JQuery<HTMLButtonElement>
  private roomCreateButton: JQuery<HTMLButtonElement>

  private canvas: JQuery<HTMLCanvasElement>

  // Three.js
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private clock: Clock
  private composer: EffectComposer
  private outlinePass: OutlinePass

  private roomList: RoomList
  private board: ChessBoard

  private renderRunning: boolean
  private lastHoveredUuid: string
  private rearrangePromise: Promise<void>

  private cameraSlideActions: AnimationAction[] = []
  private cameraSlideMixer: AnimationMixer
  private cameraMoving: boolean = false
  private lookAt: Vector3
  private cameraEndCallback: () => void

  private pieces: Map<number, Piece> = new Map()

  constructor() {
    this.roomTitle = $("#room-title")
    this.roomRefreshButton = $("#btn-refresh")
    this.roomCreateButton = $("#btn-create")
    this.canvas = $("#stage")

    // DOM事件
    this.roomRefreshButton.on("click", () => eventDispatcher.dispatch("fetchRooms", new FetchRoomEvent()))
    this.roomCreateButton.on("click", () => eventDispatcher.dispatch("createRoom", new CreateRoomEvent()))

    // 全局DOM事件
    window.addEventListener("resize", this.handleResize.bind(this))
    window.addEventListener("blur", this.handleWindowBlur.bind(this))
    window.addEventListener("focus", this.handleWindowFocus.bind(this))
    this.canvas.on("pointermove", e => this.handlePointerMove(e.originalEvent as PointerEvent))
    this.canvas.on("pointerdown", this.handlePointerDown.bind(this))

    // Three.js场景初始化
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({
      canvas: this.canvas[0],
      antialias: true,
    })
    this.renderer.shadowMap.enabled = true
    this.clock = new Clock()
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      3000
    )
    this.camera.position.set(0, 0, 600)
    this.camera.lookAt(0, 0, 0)
    this.setLight()

    this.outlinePass = new OutlinePass(
      new Vector2(this.canvas.width(), this.canvas.height()),
      this.scene,
      this.camera
    )
    this.outlinePass.edgeStrength = 10
    this.outlinePass.edgeGlow = 1
    this.outlinePass.visibleEdgeColor.set("#dd00c2")
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(this.outlinePass)
    let effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms['resolution'].value.set(1 / this.canvas.width(), 1 / this.canvas.height())
    this.composer.addPass(effectFXAA)

    this.handleResize()

    // 开始渲染
    this.renderRunning = true
    this.render()

    // 预处理时间轴
    this.cameraSlideMixer = new AnimationMixer(this.camera)
    boardStyles.forEach(style => {
      this.cameraSlideActions.push(
        this.cameraSlideMixer.clipAction(
          new SlideAnimationClip(0.8, this.camera.position, style.cameraPosition)
        ).setLoop(LoopOnce, 1)
      )
    })
    this.cameraSlideActions.forEach(action => action.clampWhenFinished = true)
    this.cameraSlideMixer.addEventListener("finished", this.handleCameraSlideEnd)
  }

  // 控制方法
  public enterRoomPage(): void {
    this.roomTitle[0].dataset.position = "origin"
    if (!this.roomList) {
      this.roomList = new RoomList()
      this.scene.add(this.roomList)
    }
    this.setRoomList(this.canvas.width(), this.canvas.height())
  }

  public leaveRoomPage(): void {
    this.roomTitle[0].dataset.position = "top"
  }

  public async focusRoom(room: Room): Promise<void> {
    this.roomTitle[0].dataset.position = "top"
    if (this.rearrangePromise) {
      await this.rearrangePromise
    }
    await this.roomList.focus(room.roomName)
  }

  public unfocusRoom(): void {
    this.roomList.unfocus()
  }

  public set rooms(rooms: Room[]) {
    this.roomList.rooms = rooms
  }

  public set roomListLoading(loading: boolean) {
    this.roomRefreshButton.text(loading ? "加载中" : "刷新列表")
    this.roomRefreshButton[0].disabled = loading
  }

  public updateRoom(room: Room) {
    this.roomList.updateRoom(room)
  }



  public enterGame(): void {
    let size = G.currentRoom.size, index = boardStyles.map(style => style.size).indexOf(size)
    let config = boardStyles[index]
    let cameraAction = this.cameraSlideActions[index]
    this.board = G.chessBoards[index]
    this.scene.add(this.board)
    this.roomList.hidden = true
    this.lookAt = new Vector3(50, 0, config.positionZ - 100)
    setTimeout(() => {
      this.cameraMoving = true
      cameraAction.reset()
      cameraAction.setEffectiveTimeScale(1)
      cameraAction.play()
    }, 200);
  }

  public setIndicator(x: number, y: number) {
    if (this.board) {
      this.board.setIndicator(x, y, this.pieces.has(x * 20 + y))
    }
  }

  public set boardDisabled(disabled: boolean) {
    if (this.board) {
      this.board.disabled = disabled
    }
  }

  public addChess(chess: Chess): void {
    let piece = new Piece(
      chess.type === 1 ? blackPieceColor : whitePieceColor,
      this.board.calculateChessPosition(chess.x, chess.y)
    )
    this.pieces.set(chess.x * 20 + chess.y, piece)
    this.scene.add(piece)
    piece.drop()
  }
  public removeChess(x: number, y: number): void {
    let piece = this.pieces.get(x * 20 + y)
    if (piece) {
      piece.lift().then(() => {
        this.scene.remove(piece)
      })
      this.pieces.delete(x * 20 + y)
    }
  }
  public removeAllChesses(): void {
    this.pieces.forEach(piece => {
      this.scene.remove(piece)
    })
    this.pieces.clear()
  }
  public highlightChess(x: number, y: number): void {
    this.outlinePass.selectedObjects = this.outlinePass.selectedObjects
      .concat(this.pieces.get(x * 20 + y))
  }

  public unhighlightAllChesses(): void {
    this.outlinePass.selectedObjects = []
  }

  public async leaveGame() {
    let size = G.currentRoom.size, index = boardStyles.map(style => style.size).indexOf(size)
    let cameraAction = this.cameraSlideActions[index]
    this.cameraMoving = true
    cameraAction.reset()
    cameraAction.time = 0.8
    cameraAction.setEffectiveTimeScale(-1)
    this.cameraMoving = true
    cameraAction.play()
    await new Promise<void>(res => {
      this.cameraEndCallback = res
    })
    cameraAction.enabled = false
    this.roomList.hidden = false
    setTimeout(() => {
      this.scene.remove(this.board)
      this.board = null
      this.camera.lookAt(0, 0, 0)
      this.removeAllChesses()
    }, 200);
  }

  // 私有方法
  private handleResize(): void {
    let width = window.innerWidth - 100, height = window.innerHeight - 100
    this.canvas.width(width).height(height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
    
    this.setRoomList(width, height)

    if (!this.renderRunning) {
      this.doRender()
    }
  }

  private render = (): void => {
    if (this.renderRunning) {
      this.doRender()
      requestAnimationFrame(this.render)
    }
  }

  private doRender(): void {
    this.renderer.render(this.scene, this.camera)
    let delta = this.clock.getDelta()
    G.mixers.forEach(mixer => mixer.update(delta))
    if (this.cameraMoving) {
      this.cameraSlideMixer.update(delta)
      this.camera.lookAt(this.lookAt)
    }
  }

  private handleWindowBlur(): void {
    // this.renderRunning = false
  }

  private handleWindowFocus(): void {
    // this.renderRunning = true
    // this.render()
  }

  private setLight(): void {
    let light = new AmbientLight(0xffffff, 0.5)
    this.scene.add(light)
  }

  private handlePointerMove(event: PointerEvent): void {
    let rayCaster = new Raycaster()
    rayCaster.setFromCamera({
      x: ((event.x - 50) / this.canvas.width()) * 2 - 1,
      y: -((event.y - 100) / this.canvas.height()) * 2 + 1
    }, this.camera)
    if (G.pointerHandlers.objects.length) {
      let intersects = rayCaster.intersectObjects(G.pointerHandlers.objects, false)[0]
      let firstUuid = intersects?.object?.uuid
      let point = intersects?.point
      
      if (this.lastHoveredUuid && (!firstUuid || firstUuid !== this.lastHoveredUuid)) {
        G.pointerHandlers.get(this.lastHoveredUuid).callback("leave")
      }
      if (firstUuid) {
        let handler = G.pointerHandlers.get(firstUuid)
        handler.callback("move", point)
        if (firstUuid !== this.lastHoveredUuid) {
          handler.callback("hover", point)
        }
      }
      this.lastHoveredUuid = firstUuid
    }
  }

  private handlePointerDown(): void {
    if (this.lastHoveredUuid) {
      G.pointerHandlers.get(this.lastHoveredUuid).callback("click")
    }
  }

  private setRoomList(width: number, height: number): void {
    if (this.roomList) {
      this.rearrangePromise = this.roomList.setViewSize(width, height)
      if (height > 700) {
        if (this.roomList.position.z === 0) {
          this.roomList.slideTo(0, 0, -80)
          console.log(-80)
        }
      }
      else {
        if (this.roomList.position.z === -80) {
          this.roomList.slideTo(0, 0, 0)
          console.log(0)
        }
      }
    }
  }

  private handleCameraSlideEnd = (): void => {
    this.cameraMoving = false
    this.cameraEndCallback?.()
  }
}