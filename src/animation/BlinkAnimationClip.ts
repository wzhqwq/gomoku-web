import { AnimationClip, InterpolateSmooth, NumberKeyframeTrack } from "three";

export default class BlinkAnimationClip extends AnimationClip {
  constructor(duration: number, nodeFinder: string = "") {
    super(null, duration, [new BlinkTrack(duration, nodeFinder)]);
  }
}

class BlinkTrack extends NumberKeyframeTrack {
  constructor(duration: number, nodeFinder: string) {
    super(nodeFinder + ".material.opacity", [0, duration / 2, duration], [1, 0.8, 0], InterpolateSmooth)
  }
}