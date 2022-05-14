import BaseMessage from "./BaseMessage"

export default class GameOverMessage implements BaseMessage {
  public readonly type: string = "gameOver"
  public readonly winner: string

  constructor (object: any) {
    this.winner = object.winnerUsername
  }
}