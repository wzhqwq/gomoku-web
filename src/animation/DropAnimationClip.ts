import { AnimationClip, InterpolateSmooth, NumberKeyframeTrack, Vector3 } from "three"
import { BlinkTrack } from "./BlinkAnimationClip"
import { SlideTrack } from "./SlideAnimationClip"

export default class DropAnimationClip extends AnimationClip {
  constructor(duration: number, endPoint: Vector3, nodeFinder: string = "") {
    super(null, duration, [
      new SlideTrack(
        duration,
        endPoint.clone().add(new Vector3(0, 0, 100)),
        endPoint,
        nodeFinder,
      ),
      new RotateTrack(
        duration,
        nodeFinder,
      ),
      new BlinkTrack(
        duration,
        nodeFinder,
        false,
      ),
    ])
  }
}

class RotateTrack extends NumberKeyframeTrack {
  constructor(duration: number, nodeFinder: string) {
    super(nodeFinder + ".rotateX", [0, duration * 0.8, duration], [Math.PI / 4, Math.PI / 4, Math.PI / 2], InterpolateSmooth)
  }
}