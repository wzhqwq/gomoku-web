import * as $ from "jquery"
import { AmbientLight, Clock, PerspectiveCamera, Raycaster, Renderer, Scene, WebGLRenderer } from "three"
import RoomInfo from "../item/RoomInfo"
import RoomList from "../item/RoomList"
import Game from "../model/base/Game"
import Room from "../model/base/Room"
import eventDispatcher from "../util/EventDispatcher"
import G from "../util/global"
import RoomSelectEvent from "../event/RoomSelectEvent"

export default class Stage {
  // DOM
  private roomTitle: JQuery<HTMLDivElement>
  
  private roomRefreshButton: JQuery<HTMLButtonElement>
  private roomCreateButton: JQuery<HTMLButtonElement>

  private canvas: JQuery<HTMLCanvasElement>

  // Three.js
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: Renderer
  private clock: Clock

  private roomList: RoomList

  private renderRunning: boolean
  private lastHoveredUuid: string

  constructor() {
    this.roomTitle = $("#room-title")
    this.roomRefreshButton = $("#btn-refresh")
    this.roomCreateButton = $("#btn-create")
    this.canvas = $("#stage")

    window.addEventListener("resize", this.handleResize.bind(this))
    window.addEventListener("blur", this.handleWindowBlur.bind(this))
    window.addEventListener("focus", this.handleWindowFocus.bind(this))
    window.addEventListener("pointermove", this.handlePointerMove.bind(this))
    window.addEventListener("pointerdown", this.handlePointerDown.bind(this))

    // Three.js init
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({
      canvas: this.canvas[0],
      antialias: true
    })
    this.clock = new Clock()
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    this.camera.position.set(0, 0, 900)
    this.camera.lookAt(0, 0, 0)
    this.setLight()

    this.handleResize()
    

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

  public bindRoomSelect(callback: (e: RoomSelectEvent) => void): void {
    eventDispatcher.listen(RoomSelectEvent.TYPE, callback)
  }

  // 私有方法
  private handleResize(): void {
    this.canvas.width(window.innerWidth).height(window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
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
      let delta = this.clock.getDelta()
      G.mixers.forEach(mixer => mixer.update(delta))
    }
  }

  private handleWindowBlur(): void {
    this.renderRunning = false
  }

  private handleWindowFocus(): void {
    this.renderRunning = true
    this.render()
  }

  private setLight(): void {
    let light = new AmbientLight(0xffffff, 0.5)
    this.scene.add(light)
  }

  private handlePointerMove(event: PointerEvent): void {
    if (G.pointerHandlers.objects.length) {
      let rayCaster = new Raycaster()
      rayCaster.setFromCamera({
        x: (event.x / window.innerWidth) * 2 - 1,
        y: -(event.y / window.innerHeight) * 2 + 1
      }, this.camera)
      let intersects = rayCaster.intersectObjects(G.pointerHandlers.objects)
        .map(intersect => intersect.object.uuid)[0]
      if (this.lastHoveredUuid && (!intersects || intersects !== this.lastHoveredUuid)) {
        G.pointerHandlers.get(this.lastHoveredUuid).callback("leave")
      }
      if (intersects && intersects !== this.lastHoveredUuid) {
        G.pointerHandlers.get(intersects).callback("hover")
      }
      this.lastHoveredUuid = intersects
    }
  }

  private handlePointerDown(): void {
    if (this.lastHoveredUuid) {
      G.pointerHandlers.get(this.lastHoveredUuid).callback("click")
    }
  }
}