import Chess from "./Chess";

export default class PlayLog {
  constructor(
    public username: string,
    public chess: Chess,
    public time: Date
  ) {}

  public static fromRawObject(rawObject: any): PlayLog {
    return new PlayLog(
      rawObject.username,
      Chess.fromRawObject(rawObject.chess),
      new Date(rawObject.time)
    )
  }
}