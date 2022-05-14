import { AnimationMixer, Group, Object3D } from "three";
import AnimatedComponent from "./AnimatedComponent";
import BaseComponent from "./BaseComponent";
import HidableComponent from "./HidableComponent";
import SizedComponent from "./SizedComponent";

export default class BaseGroup extends Group
    implements AnimatedComponent, HidableComponent, SizedComponent {
  public animationMixer: AnimationMixer;
  public animationEnabled: boolean;
  public width: number;
  public height: number;

  private _hidden: boolean = false;

  set hidden(hidden: boolean) {
    this._hidden = hidden
    this.children.forEach((child: Object3D) => {
      if (!(child instanceof BaseComponent) && !(child instanceof BaseGroup)) return
      child.animationEnabled = this.animationEnabled
      child.hidden = hidden
    })
  }

  get hidden(): boolean {
    return this._hidden
  }

  setPositionByAnchor(
    anchor: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center",
    x: number,
    y: number,
    z: number
  ): void {
    switch (anchor) {
      case "center":
        this.position.set(x - this.width / 2, y - this.height / 2, z)
        break
      case "topLeft":
        this.position.set(x, y - this.height, z)
        break
      case "topRight":
        this.position.set(x - this.width, y - this.height, z)
        break
      case "bottomLeft":
        this.position.set(x, y, z)
        break
      case "bottomRight":
        this.position.set(x - this.width, y, z)
        break
    }
  }
}