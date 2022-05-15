import { AnimationClip, InterpolateSmooth, Vector3, VectorKeyframeTrack } from "three"

export default class SlideAnimationClip extends AnimationClip {
  constructor(duration: number, from: Vector3, to: Vector3, nodeFinder: string = "") {
    super(null, duration, [new SlideTrack(duration, from, to, nodeFinder)])
  }
}

// a + b * 4 / 5 - a * 4 / 5

export class SlideTrack extends VectorKeyframeTrack {
  constructor(duration: number, from: Vector3, to: Vector3, nodeFinder: string) {
    let center = from.clone().multiplyScalar(0.2).add(to.clone().multiplyScalar(0.8))
    let timeline = [
      ...from.toArray(),
      ...center.toArray(),
      ...to.toArray()
    ]
    super(nodeFinder + ".position", [0, duration / 2, duration], timeline, InterpolateSmooth)
  }
}