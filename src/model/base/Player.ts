export default class Player {
  constructor(
    public name: string,
    public online: boolean,
    public chessType: number
  ) {}

  public static fromRawObject(rawObject: any): Player {
    return new Player(rawObject.username, rawObject.isOnline, rawObject.chessType)
  }
}