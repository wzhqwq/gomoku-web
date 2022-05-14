export default class Player {
  name: string
  online: boolean
  chessType: number

  constructor(name: string, online: boolean, chessType: number) {
    this.name = name
    this.online = online
    this.chessType = chessType
  }

  public static fromRawObject(rawObject: any): Player {
    return new Player(rawObject.username, rawObject.isOnline, rawObject.chessType)
  }
}