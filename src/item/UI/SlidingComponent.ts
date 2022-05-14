export default interface SlidingComponent {
  slideTo(x: number, y: number, z: number): Promise<void>
}