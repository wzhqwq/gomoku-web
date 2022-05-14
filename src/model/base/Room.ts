import G from "@util/global";
import Player from "./Player";

export default class Room {
  constructor(
    public roomName: string,
    public players: Player[],
    public isGameStarted: boolean,
    public isGameOver: boolean,
    public size: number
  ) {}

  public static fromRawObject(rawObject: any): Room {
    let users = rawObject.users as any[]
    return new Room(
      rawObject.gameName,
      users.map(user => Player.fromRawObject(user)),
      rawObject.isGameStarted,
      rawObject.isGameOver,
      rawObject.size,
    )
  }

  public static createRoom(roomName: string, size: number) {
    return new Room(roomName, [G.me], false, false, size)
  }
}