import { AnimationClip, InterpolateSmooth, VectorKeyframeTrack } from "three";

export default class ScaleAnimationClip extends AnimationClip {
  constructor(duration: number, nodeFinder: string = "") {
    super(null, duration, [new ScaleTrack(duration, nodeFinder)]);
  }
}

class ScaleTrack extends VectorKeyframeTrack {
  constructor(duration: number, nodeFinder: string) {
    let timeline = [1, 1, 1, 1.04, 1.04, 1.04, 1.06, 1.06, 1.06]
    super(nodeFinder + ".scale", [0, duration / 2, duration], timeline, InterpolateSmooth)
  }
}