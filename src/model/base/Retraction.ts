import PlayLog from "./PlayLog"

export default class Retraction {
  public readonly message: string

  constructor (
    public readonly retractedLog: PlayLog[],
    public readonly requestedBy: string
  ) {}

  public static fromRawObject(rawObject: any): Retraction {
    return new Retraction(
      rawObject.retractedLog.map(PlayLog.fromRawObject),
      rawObject.requestedBy
    )
  }
}