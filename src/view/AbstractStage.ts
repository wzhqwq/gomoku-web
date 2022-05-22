import Chess from "@model/base/Chess"
import Room from "@model/base/Room"

export default interface AbstractStage {
  enterRoomPage(): void
  focusRoom(room: Room): Promise<void>
  unfocusRoom(): void
  updateRoom(room: Room): void

  enterGame(): void
  leaveGame(): Promise<void>
  setIndicator(x: number, y: number, disabled: boolean): void
  addChess(chess: Chess): void
  removeChess(x: number, y: number): void
  removeAllChesses(): void
  highlightChess(x: number, y: number): void
  unhighlightAllChesses(): void

  set rooms(rooms: Room[])
  set roomListLoading(loading: boolean)

  set boardDisabled(disabled: boolean)
}