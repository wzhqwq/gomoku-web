import Chess from "@model/base/Chess"
import Room from "@model/base/Room"

export default interface AbstractStage {
  enterRoomPage(): void
  focusRoom(room: Room): Promise<void>
  updateRoom(room: Room): void

  enterGame(): void
  leaveGame(): void
  setIndicator(x: number, y: number): void
  addChess(chess: Chess): void
  removeChess(x: number, y: number): void
  highlightChess(x: number, y: number): void

  set rooms(rooms: Room[])
  set roomListLoading(loading: boolean)
}