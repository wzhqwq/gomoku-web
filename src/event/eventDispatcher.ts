import BaseEvent from "./BaseEvent"
import { RoomCreateEvent, RoomFetchEvent } from "./emptyEvents"
import RoomSelectEvent from "./RoomSelectEvent"

export interface EventMap {
  selectRoom: RoomSelectEvent
  createRoom: RoomCreateEvent
  fetchRooms: RoomFetchEvent
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