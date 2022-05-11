import * as $ from "jquery"
import Modal from "./Modal"

export default class UserInput extends Modal {
  private nameInput: JQuery<HTMLInputElement>
  private urlInput: JQuery<HTMLInputElement>

  // promises
  private confirmResolver: (value?: string[] | PromiseLike<string[]>) => void

  constructor() {
    super("#input-modal")
    this.nameInput = $("#nickname")
    this.urlInput = $("#server-url")

    $("#btn-confirm-nickname").on("click", () =>
      this.confirmResolver?.([
        this.nameInput.val() as string,
        this.urlInput.val() as string,
      ])
    )
    $("#btn-cancel-nickname").on("click", () => this.confirmResolver?.(null))
  }

  public ask(defaultName: string, defaultUrl: string): Promise<string[]> {
    this.nameInput.val(defaultName)
    this.urlInput.val(defaultUrl)
    
    this.showModal()

    return new Promise(resolve => {
      this.confirmResolver = resolve
    })
  }
}
