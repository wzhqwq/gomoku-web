import Room from "@model/base/Room"

export default interface AbstractStage {
  enterRoomPage(): void
  leaveRoomPage(): void
  focusRoom(room: Room): void

  enterGame(): void
  leaveGame(): void

  set rooms(rooms: Room[])
  set roomListLoading(loading: boolean)
}