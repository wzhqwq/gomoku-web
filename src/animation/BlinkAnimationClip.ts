import { AnimationClip, InterpolateSmooth, NumberKeyframeTrack } from "three";

export default class BlinkAnimationClip extends AnimationClip {
  constructor(duration: number, nodeFinder: string = "", show: boolean = true) {
    super(null, duration, [new BlinkTrack(duration, nodeFinder, show)]);
  }
}

export class BlinkTrack extends NumberKeyframeTrack {
  constructor(duration: number, nodeFinder: string, show: boolean) {
    super(nodeFinder + ".material.opacity", [0, duration / 2, duration], show ? [1, 0.8, 0] : [0, 0.8, 1], InterpolateSmooth)
  }
}