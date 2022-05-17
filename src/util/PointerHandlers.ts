import { Object3D, Vector3 } from "three"

type PointerHandler = {
  target: Object3D
  callback: (type: "hover" | "click" | "leave" | "move", point?: Vector3) => void
}

export default class PointerHandlers extends Map<string, PointerHandler> {
  public readonly objects: Object3D[] = []

  public set(uuid: string, handler: PointerHandler) {
    super.set(uuid, handler)
    this.objects.push(handler.target)
    return this
  }

  public delete(uuid: string): boolean {
    const handler = super.get(uuid)
    if (!handler) return false
    super.delete(uuid)
    this.objects.splice(this.objects.indexOf(handler.target), 1)
    return true
  }
}