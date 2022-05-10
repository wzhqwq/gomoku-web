import { Type } from "typescript"

class EventDispatcher {
  private listeners: Map<Symbol, Listener[]> = new Map()

  public listen<T>(type: Symbol, callback: (data: T) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push({
      callback,
      type
    })
  }

  public dispatch<T>(type: Symbol, data: T): void {
    if (!this.listeners.has(type)) return
    this.listeners.get(type).forEach(listener => {
      listener.callback(data)
    })
  }
}

type Listener = {
  type: Symbol
  callback: (data: any) => void
}

const eventDispatcher = new EventDispatcher()

export default eventDispatcher