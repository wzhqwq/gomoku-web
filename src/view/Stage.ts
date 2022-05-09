import * as $ from "jquery"
import { AmbientLight, AnimationMixer, Camera, Clock, PerspectiveCamera, Renderer, Scene, WebGLRenderer } from "three"
import RoomInfo from "../item/RoomInfo"
import RoomList from "../item/RoomList"
import Game from "../model/base/Game"
import Room from "../model/base/Room"
import G from "../util/global"

export default class Stage {
  // DOM
  private roomTitle: JQuery<HTMLDivElement>
  
  private roomRefreshButton: JQuery<HTMLButtonElement>
  private roomCreateButton: JQuery<HTMLButtonElement>

  private canvas: JQuery<HTMLCanvasElement>

  // Three.js
  private scene: Scene
  private camera: Camera
  private renderer: Renderer
  private clock: Clock

  private roomList: RoomList

  private renderRunning: boolean

  constructor() {
    this.roomTitle = $("#room-title")
    this.roomRefreshButton = $("#btn-refresh")
    this.roomCreateButton = $("#btn-create")
    this.canvas = $("#stage")

    window.addEventListener("resize", this.handleResize.bind(this))
    window.addEventListener("blur", this.handleWindowBlur.bind(this))
    window.addEventListener("focus", this.handleWindowFocus.bind(this))

    // Three.js init
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({
      canvas: this.canvas[0],
      antialias: true
    })
    this.clock = new Clock()
    this.handleResize()
    
    this.setLight()

    this.renderRunning = true
    this.render()
  }

  // 控制方法
  public enterRoomPage(): void {
    this.roomTitle[0].dataset.position = "origin"
    if (!this.roomList) {
      this.roomList = new RoomList(window.innerWidth, window.innerHeight - 300)
    }
    this.scene.add(this.roomList)
  }

  public leaveRoomPage(): void {
    this.roomTitle[0].dataset.position = "top"
    this.scene.remove(this.roomList)
  }

  public set rooms(rooms: Room[]) {
    this.roomList.rooms = rooms
  }

  public set roomListLoading(loading: boolean) {
    this.roomRefreshButton.text(loading ? "加载中" : "刷新列表")
    this.roomRefreshButton[0].disabled = loading
  }

  // 事件绑定
  public bindRoomRefresh(callback: () => void): void {
    this.roomRefreshButton.on("click", callback)
  }

  public bindRoomCreate(callback: () => void): void {
    this.roomCreateButton.on("click", callback)
  }

  public bindRoomSelect(callback: (game: Game) => void): void {
  }

  // 私有方法
  private handleResize(): void {
    this.canvas.width(window.innerWidth)
    this.canvas.height(window.innerHeight)
    this.setCamera()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    if (!this.renderRunning) {
      this.renderer.render(this.scene, this.camera)
    }
    if (this.roomList) {
      this.roomList.width = window.innerWidth
      this.roomList.height = window.innerHeight - 300
    }
  }

  private render(): void {
    if (this.renderRunning) {
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render.bind(this))
      G.mixers.forEach(mixer => mixer.update(this.clock.getDelta()))
    }
  }

  private handleWindowBlur(): void {
    this.renderRunning = false
  }

  private handleWindowFocus(): void {
    this.renderRunning = true
    this.render()
  }

  private setCamera(): void {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.set(0, 0, 900)
    this.camera.lookAt(0, 0, 0)
  }

  private setLight(): void {
    let light = new AmbientLight(0xffffff, 0.5)
    this.scene.add(light)
  }
}