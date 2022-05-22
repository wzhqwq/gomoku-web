import BaseEvent from "./BaseEvent"

export class CreateRoomEvent implements BaseEvent {
  public TYPE = Symbol("CreateRoomEvent")
}

export class FetchRoomEvent implements BaseEvent {
  public TYPE = Symbol("FetchRoomEvent")
}

export class GameOverEvent implements BaseEvent {
  public TYPE = Symbol("GameOverEvent")
}