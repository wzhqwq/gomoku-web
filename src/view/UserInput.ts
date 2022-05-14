import * as $ from "jquery"
import Modal from "./Modal"

export default class UserInput extends Modal {
  private nameInput: JQuery<HTMLInputElement>
  private urlInput: JQuery<HTMLInputElement>
  private nameHelper: JQuery<HTMLDivElement>

  // promises
  private confirmResolver: (value?: string[] | PromiseLike<string[]>) => void

  constructor() {
    super("#input-modal")
    this.nameInput = $("#nickname")
    this.urlInput = $("#server-url")
    this.nameHelper = $("#nickname-helper")

    $("#btn-confirm-nickname").on("click", () =>
      this.confirmResolver?.([
        this.nameInput.val() as string,
        this.urlInput.val() as string,
      ])
    )
    $("#btn-cancel-nickname").on("click", () => this.confirmResolver?.(null))
    this.nameHelper.on("animationend", () => this.nameHelper.removeClass("shake"))
  }

  public ask(defaultName: string, defaultUrl: string): Promise<string[]> {
    this.nameInput.val(defaultName)
    this.urlInput.val(defaultUrl)
    
    this.showModal()

    return new Promise(resolve => {
      this.confirmResolver = resolve
    })
  }

  public showError(error: string) {
    this.nameHelper.text(error)
    this.nameHelper.addClass(["has-error", "shake"])
  }

  public hideError() {
    this.nameHelper.removeClass("has-error")
  }
}
