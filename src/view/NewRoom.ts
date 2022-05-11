import * as $ from "jquery"
import Modal from "./Modal"

export default class UserInput extends Modal {
  private roomInput: JQuery<HTMLInputElement>

  // promises
  private confirmResolver: (value?: string | PromiseLike<string>) => void

  constructor() {
    super("#new-room-modal")
    this.roomInput = $("#new-room")

    $("#btn-confirm-new-room").on("click", () =>
      this.confirmResolver?.(this.roomInput.val() as string)
    )
    $("#btn-cancel-new-room").on("click", () => this.confirmResolver?.(null))
  }

  public ask(): Promise<string> {
    this.roomInput.val("")
    
    this.showModal()

    return new Promise(resolve => {
      this.confirmResolver = resolve
    })
  }
}
