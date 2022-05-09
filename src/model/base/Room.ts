import Player from "./Player";

export default class Room {
  gameName: string
  players: Player[]
  isGameStarted: boolean
  isGameOver: boolean
  size: number

  constructor(rawObject: any) {
    this.gameName = rawObject.gameName
    let users = rawObject.users as any[]
    this.players = users.map(user => Player.fromRawObject(user))
    this.isGameStarted = rawObject.isGameStarted
    this.isGameOver = rawObject.isGameOver
    this.size = rawObject.size
  }
}