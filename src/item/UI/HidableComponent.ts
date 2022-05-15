export default interface HidableComponent {
  set hidden(hidden: boolean)
  get hidden(): boolean
  setHiddenImmediately(hidden: boolean): void
  passVisibility(hidden: boolean, immediately: boolean): void
}