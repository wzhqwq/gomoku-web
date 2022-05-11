import * as $ from "jquery"

export default class Modal {
  protected modal: JQuery<HTMLDivElement>

  constructor(selector: string) {
    this.modal = $(selector)
    this.modal.on("transitionend", () => {
      if (this.modal[0].dataset.toggle === "hide") {
        this.modal.css("display", "none");
      }
    })
    if (this.modal[0].dataset.toggle === "hide") {
      this.modal.css("display", "none")
    }
  }

  public showModal(): void {
    this.modal.css("display", "flex")
    setTimeout(() => {
      this.modal[0].dataset.toggle = "open"
    })
  }

  public hideModal(): void {
    this.modal[0].dataset.toggle = "hide"
  }
}