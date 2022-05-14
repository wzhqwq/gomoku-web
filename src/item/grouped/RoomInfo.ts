import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, AnimationMixer, LoopPingPong, MeshMatcapMaterial, BufferGeometry, Material } from "three"
import Room from "@model/base/Room"
import G from "@util/global"
import RoundRectText from "@item/UI/RoundRectText"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import Player from "@model/base/Player"
import eventDispatcher from "@event/eventDispatcher"
import RoomSelectEvent from "@event/SelectRoomEvent"
import RoundRectButton from "@item/UI/RoundRectButton"
import { primaryColor, primaryDarkColor } from "@util/constants"
import BaseGroup from "@item/UI/BaseGroup"
import Versus from "@item/basic/Versus"

export default class RoomInfo extends BaseGroup {
  private boardFace: Mesh
  private gameName: RoundRectText

  private playersInfo: PlayersInfo
  private bottomArea: RoundRectText = null
  private lastBottomState: number = -1
  private lastPlayersLength: number = -1

  public room: Room

  constructor(room: Room, createBySelf: boolean = false) {
    super()
    this.width = 350
    this.height = 120

    // 绘制棋盘预览
    let boardFaceTexture = G.boardFaces.find(
      face => face.size === room.size
    ).texture
    const faceRect = new PlaneBufferGeometry(120, 120)
    const faceMaterial = new MeshBasicMaterial({
      map: boardFaceTexture,
      transparent: true
    })
    this.boardFace = new Mesh(faceRect, faceMaterial)
    this.boardFace.position.set(60, 60, 0)
    this.add(this.boardFace)

    // 绘制房间名称
    this.gameName = new RoundRectText({ content: room.roomName, size: 26, maxWidth: 220 })
    this.gameName.setPositionByAnchor(
      "bottomLeft",
      130,
      120 - this.gameName.height,
      0
    )
    this.add(this.gameName)

    this.repaintInfo(room, createBySelf)
  }

  public repaintInfo(room: Room, createBySelf: boolean = false) {
    this.room = room

    let startY = 115 - this.gameName.height

    // 绘制玩家信息
    if (!this.playersInfo) {
      this.playersInfo = new PlayersInfo(room.players)
      this.playersInfo.setPositionByAnchor("bottomLeft", 130, startY - this.playersInfo.height, 0)
      this.add(this.playersInfo)
    }
    else if (room.players.length !== this.lastPlayersLength) {
      this.playersInfo.repaintInfo(room.players)
    }
    startY -= this.playersInfo.height + 5

    // 绘制操作区域，以下四个函数可以在状态没有发生变化时不做任何事情
    let hasMe = room.players.some(p => p.name === G.me.name && !p.online)

    if (!room.isGameStarted || hasMe) {
      // 可以加入
      this.drawEnterGame(130, startY, room)
    }
    else if (createBySelf) {
      // 自己创建的房间，等待玩家加入
      this.drawWaitForOpponent(130, startY)
    }
    else if (room.isGameOver) {
      // 游戏结束
      this.intoEndedState(130, startY)
    }
    else {
      // 游戏进行中
      this.intoPlayingState(130, startY)
    }
  }

  private drawEnterGame(x: number, y: number, room: Room) {
    if (this.lastBottomState == 0) return
    this.lastBottomState = 0

    let hasMe = room.players.some(p => p.name === G.me.name && !p.online)

    let requesting = new RoundRectText({
      content: "请求中...",
      size: 16,
      bgColor: primaryDarkColor,
      color: "#ddd",
      exactWidth: 220,
    })
    requesting.setPositionByAnchor("bottomLeft", x, y - requesting.height, 0)
    requesting.animationEnabled = false
    requesting.hidden = true
    requesting.animationEnabled = true
    this.add(requesting)
    
    this.bottomArea = new RoundRectButton({
      content: hasMe ? "重新加入游戏" : "加入游戏",
      size: 16,
      bgColor: primaryColor,
      exactWidth: 220,
      onClick: () => {
        this.bottomArea.hidden = true
        requesting.hidden = false
        requesting.blinking = true
        eventDispatcher.dispatch("selectRoom", new RoomSelectEvent(
          room,
          (success: boolean) => {
            requesting.blinking = false
            requesting.hidden = true
            if (!success) {
              this.bottomArea.hidden = false
            }
          }
        ))
      }
    })
    this.bottomArea.setPositionByAnchor("bottomLeft", x, y - this.bottomArea.height, 0)

    this.add(this.bottomArea)
  }

  private drawWaitForOpponent(x: number, y: number) {
    if (this.lastBottomState == 1) return
    this.lastBottomState = 1
    
    this.bottomArea = new RoundRectText({
      content: "等待玩家加入...",
      size: 16,
      bgColor: primaryDarkColor,
      color: "#ddd",
      exactWidth: 220,
    })
    this.bottomArea.setPositionByAnchor("bottomLeft", x, y - this.bottomArea.height, 0)
    this.bottomArea.blinking = true

    this.add(this.bottomArea)
  }

  private intoPlayingState(x: number, y: number) {
    if (this.lastBottomState == 2) return
    this.lastBottomState = 2
    
    let isChange = this.bottomArea !== null
    if (isChange) {
      this.bottomArea.blinking = false
      this.bottomArea.hidden = true
    }

    this.bottomArea = new RoundRectText({
      content: "游戏中",
      size: 16,
      bgColor: "#004435",
      color: "#2bffd0",
      exactWidth: 220,
    })

    this.bottomArea.setPositionByAnchor("bottomLeft", x, y - this.bottomArea.height, 0)
    if (isChange) {
      this.bottomArea.animationEnabled = false
      this.bottomArea.hidden = true
      this.bottomArea.animationEnabled = true
      this.bottomArea.hidden = false
    }

    this.add(this.bottomArea)
  }

  private intoEndedState(x: number, y: number) {
    if (this.lastBottomState == 3) return
    this.lastBottomState = 3
    
    let isChange = this.bottomArea !== null
    if (isChange) {
      this.bottomArea.blinking = false
      this.bottomArea.hidden = true
    }

    this.bottomArea = new RoundRectText({
      content: "游戏结束",
      size: 16,
      bgColor: "#333",
      color: "#ddd",
      exactWidth: 220,
    })

    this.bottomArea.setPositionByAnchor("bottomLeft", x, y - this.bottomArea.height, 0)
    if (isChange) {
      this.bottomArea.animationEnabled = false
      this.bottomArea.hidden = true
      this.bottomArea.animationEnabled = true
      this.bottomArea.hidden = false
    }

    this.add(this.bottomArea)
  }
}

class PlayersInfo extends BaseGroup {
  private player1: RoundRectText
  private emptyPlayer: RoundRectText

  constructor(players: Player[] = []) {
    super()
    
    this.player1 = new RoundRectText({ content: players[0].name, maxWidth: 100 })
    this.player1.setPositionByAnchor("bottomLeft", 0, 0, 0)
    this.add(this.player1)
    this.height = this.player1.height
    this.width = this.player1.width

    this.repaintInfo(players)
  }

  public repaintInfo(players: Player[]) {
    if (players.length === 2) {
      if (this.emptyPlayer) {
        this.emptyPlayer.blinking = false
        this.emptyPlayer.hidden = true
      }
      
      let versus = new Versus()
      versus.position.set(this.player1.width - 10, 8, 0)
      this.add(versus)

      let player2 = new RoundRectText({ content: players[1].name, maxWidth: 100 })
      player2.setPositionByAnchor("bottomLeft", this.player1.width + 20, 0, 0)
      this.add(player2)
      if (this.emptyPlayer) {
        player2.animationEnabled = false
        player2.hidden = true
        player2.animationEnabled = true
        player2.hidden = false
      }
      this.width = this.player1.width + player2.width + 20
    }
    else {
      this.emptyPlayer = new RoundRectText({
        content: "等待对手",
        variant: "outlined",
        bgColor: "#555",
        color: "#ddd"
      })
      this.add(this.emptyPlayer)

      this.emptyPlayer.setPositionByAnchor("bottomLeft", this.player1.width + 5, 0, 0)
      this.emptyPlayer.blinking = true

      this.width = this.player1.width + this.emptyPlayer.width + 5
    }
  }
}