import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, AnimationAction, AnimationMixer, LoopPingPong, MeshMatcapMaterial } from "three"
import Room from "../model/base/Room"
import G from "../util/global"
import RoundRectText from "./RoundRectText"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import BlinkAnimationClip from "../animation/BlinkAnimationClip"
import Player from "../model/base/Player"

export default class RoomInfo extends Group {
  constructor(room: Room) {
    super()

    let boardFaceTexture = G.boardFaces.find(
      face => face.size === room.size
    ).texture
    const faceRect = new PlaneBufferGeometry(100, 100)
    const faceMaterial = new MeshBasicMaterial({
      map: boardFaceTexture,
      transparent: true
    })
    let boardFace = new Mesh(faceRect, faceMaterial)
    boardFace.position.set(50, 50, 0)
    this.add(boardFace)

    let gameName = new RoundRectText({ content: room.gameName, size: 26, minWidth: 220 })
    gameName.position.set(110, 100 - gameName.height, 0)
    this.add(gameName)

    let playersInfo = new PlayersInfo(room.players)
    playersInfo.position.set(110, 0, 0)
    this.add(playersInfo)
  }
}

class PlayersInfo extends Group {
  public readonly width: number
  public readonly height: number

  constructor(players: Player[]) {
    super()
    
    let player1 = new RoundRectText({ content: players[0].name, minWidth: 100 })
    player1.position.set(0, 0, 0)
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
      player2.position.set(player1.width + 20, 0, 0)
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
      let animationClip = new BlinkAnimationClip(1)
      let animationMixer = new AnimationMixer(emptyPlayer.mesh)
      animationMixer.clipAction(animationClip)
        .play()
        .setLoop(LoopPingPong, Infinity)
      G.mixers.set(emptyPlayer.mesh.uuid, animationMixer)

      console.log(G.mixers.values())
    }
  }
}