import RealObject from "./RealObject";

export default class Chess implements RealObject {
  constructor(
    public x: number,
    public y: number,
    public type: number
  ) {}

  public static fromRawObject(rawObject: any): Chess {
    return new Chess(rawObject.x, rawObject.y, rawObject.type)
  }
}