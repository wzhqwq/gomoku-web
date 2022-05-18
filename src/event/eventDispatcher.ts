import BaseEvent from "./BaseEvent"
import BoardChangedEvent from "./BoardChangedEvent"
import ControlEvent from "./ControlEvent"
import DoCreateRoomEvent from "./DoCreateRoomEvent"
import { CreateRoomEvent, FetchRoomEvent } from "./emptyEvents"
import IndicatorChangedEvent from "./IndicatorChangedEvent"
import PlaceEvent from "./PlaceEvent"
import PlayerRotateEvent from "./PlayerRotateEvent"
import RoomUpdatedEvent from "./RoomUpdatedEvent"
import SelectRoomEvent from "./SelectRoomEvent"
import SendMessageEvent from "./SendMessageEvent"

export interface EventMap {
  selectRoom: SelectRoomEvent
  createRoom: CreateRoomEvent
  fetchRooms: FetchRoomEvent
  doCreateRoom: DoCreateRoomEvent
  roomUpdated: RoomUpdatedEvent
  indicatorChanged: IndicatorChangedEvent
  boardChanged: BoardChangedEvent
  playerRotate: PlayerRotateEvent
  place: PlaceEvent
  control: ControlEvent
  sendMessage: SendMessageEvent
}

export type EventNameType = keyof EventMap
export type EventType = EventMap[EventNameType] & BaseEvent

class EventDispatcher {
  private listeners: Map<EventNameType, Listener<EventNameType>[]> = new Map()

  public listen<T extends EventNameType>(type: T, callback: (data: EventMap[T]) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push({
      callback,
      type
    })
  }

  public dispatch<T extends EventNameType>(type: T, data: EventMap[T]): void {
    if (!this.listeners.has(type)) return
    this.listeners.get(type).forEach(listener => {
      listener.callback(data)
    })
  }
}

type Listener<T extends EventNameType> = {
  type: T
  callback: (data: EventMap[T]) => void
}

const eventDispatcher = new EventDispatcher()

export default eventDispatcher