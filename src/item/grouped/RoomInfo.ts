import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, AnimationMixer, LoopPingPong, MeshMatcapMaterial, BufferGeometry, Material } from "three"
import Room from "@model/base/Room"
import G from "@util/global"
import RoundRectText from "@item/UI/RoundRectText"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import BlinkAnimationClip from "@animation/BlinkAnimationClip"
import Player from "@model/base/Player"
import eventDispatcher from "@event/eventDispatcher"
import RoomSelectEvent from "@event/RoomSelectEvent"
import RoundRectButton from "@item/UI/RoundRectButton"
import { primaryColor, primaryDarkColor } from "@util/constants"
import BaseComponent from "@item/UI/BaseComponent"

export default class RoomInfo extends Group {
  private bottomArea: RoundRectText
  private playersInfoArea: PlayersInfo

  constructor(room: Room, createBySelf: boolean = false) {
    super()

    // 绘制棋盘预览
    let boardFaceTexture = G.boardFaces.find(
      face => face.size === room.size
    ).texture
    const faceRect = new PlaneBufferGeometry(120, 120)
    const faceMaterial = new MeshBasicMaterial({
      map: boardFaceTexture,
      transparent: true
    })
    let boardFace = new Mesh(faceRect, faceMaterial)
    boardFace.position.set(60, 60, 0)
    this.add(boardFace)

    // 绘制房间名称
    let gameName = new RoundRectText({ content: room.gameName, size: 26, minWidth: 220 })
    gameName.position.set(
      130,
      120 - gameName.height,
      0
    )
    this.add(gameName)

    // 绘制玩家信息
    let playersInfo = new PlayersInfo(room.players)
    playersInfo.position.set(
      130,
      115 - gameName.height - playersInfo.height,
      0
    )
    this.add(playersInfo)

    // 绘制操作区域
    let hasMe = room.players.some(p => p.name === G.me.name)

    if (!room.isGameStarted || hasMe) {
      // 可以加入
      let requesting = new RoundRectText({
        content: "请求中...",
        size: 16,
        bgColor: primaryDarkColor,
        color: "#ddd",
        exactWidth: 220,
      })
      requesting.position.set(
        130,
        110 - gameName.height - playersInfo.height - requesting.height,
        0
      )
      let requestingMixer = new AnimationMixer(requesting)
      let requestingAction = requestingMixer.clipAction(new BlinkAnimationClip(1))
      requestingAction.setLoop(LoopPingPong, Infinity)
      requesting.visible = false
      this.add(requesting)
      
      this.bottomArea = new RoundRectButton({
        content: hasMe ? "重新加入游戏" : "加入游戏",
        size: 16,
        bgColor: primaryColor,
        exactWidth: 220,
        onClick: () => {
          this.bottomArea.visible = false
          requesting.visible = true
          requestingAction.play()
          G.mixers.set(requesting.uuid, requestingMixer)
          eventDispatcher.dispatch("selectRoom", new RoomSelectEvent(
            room,
            (success: boolean) => {
              requestingAction.stop()
              G.mixers.delete(requesting.uuid)
              requesting.visible = false
              if (!success) {
                this.bottomArea.visible = true
              }
            }
          ))
        }
      })
    }
    else if (createBySelf) {
      this.bottomArea = new RoundRectText({
        content: "等待玩家加入...",
        size: 16,
        bgColor: primaryDarkColor,
        color: "#ddd",
        exactWidth: 220,
      })
      this.bottomArea.position.set(
        130,
        110 - gameName.height - playersInfo.height - this.bottomArea.height,
        0
      )
      let waitingMixer = new AnimationMixer(this.bottomArea)
      let waitingAction = waitingMixer.clipAction(new BlinkAnimationClip(1))
      waitingAction.setLoop(LoopPingPong, Infinity)
    }
    else {
      this.bottomArea = new RoundRectText({
        content: room.isGameOver? "游戏结束" : "游戏中",
        size: 16,
        bgColor: room.isGameOver? "#333" : "#004435",
        color: room.isGameOver? "#ddd" : "#2bffd0",
        exactWidth: 220,
      })
    }
    this.bottomArea.position.set(
      130,
      110 - gameName.height - playersInfo.height - this.bottomArea.height,
      0
    )
    this.add(this.bottomArea)
  }
}

class PlayersInfo extends BaseComponent {
  public readonly width: number
  public readonly height: number

  protected calculateSize(): void {
    throw new Error("Method not implemented.")
  }
  protected getMaterial(): Material {
    throw new Error("Method not implemented.")
  }
  protected getGeometry(): BufferGeometry {
    throw new Error("Method not implemented.")
  }
  
  constructor(private players: Player[] = []) {
    super()
    
    let player1 = new RoundRectText({ content: players[0].name, minWidth: 100 })
    player1.setPositionByAnchor("bottomLeft", 0, 0, 0)
    this.add(player1)
    this.height = player1.height

    if (players.length === 2) {
      let fontLoader = new FontLoader()
      fontLoader.load("font/huge.json", font => {
        let versusGeometry = new TextGeometry("VS", {
          font,
          size: 18,
          height: 1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 0,
        })
        let versusMaterial = new MeshMatcapMaterial({
          matcap: G.matcaps.vs,
        })
        let versus = new Mesh(versusGeometry, versusMaterial)
        versus.rotateX(Math.PI / 8)
        versus.position.set(player1.width - 8, 8, 0)
        this.add(versus)
      })

      let player2 = new RoundRectText({ content: players[1].name, minWidth: 100 })
      player2.setPositionByAnchor("bottomLeft", player1.width + 20, 0, 0)
      this.add(player2)
    }
    else {
      let emptyPlayer = new RoundRectText({
        content: "等待对手",
        variant: "outlined",
        bgColor: "#555",
        color: "#ddd"
      })
      this.add(emptyPlayer)

      emptyPlayer.position.set(player1.width + 5, 0, 0)
      // let animationClip = new BlinkAnimationClip(1)
      // let animationMixer = new AnimationMixer(emptyPlayer)
      // animationMixer.clipAction(animationClip)
      //   .play()
      //   .setLoop(LoopPingPong, Infinity)
      // G.mixers.set(emptyPlayer.uuid, animationMixer)
      emptyPlayer.blinking = true

      console.log(G.mixers.values())
    }
  }
}