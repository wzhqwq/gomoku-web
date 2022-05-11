import BaseEvent from "./BaseEvent"

export class RoomCreateEvent implements BaseEvent {
  public TYPE = Symbol("RoomCreateEvent")
}

export class RoomFetchEvent implements BaseEvent {
  public TYPE = Symbol("RoomFetchEvent")
}