import * as $ from "jquery";

export default class UserInput {
  private modal: JQuery<HTMLDivElement>;
  private nameInput: JQuery<HTMLInputElement>;
  private urlInput: JQuery<HTMLInputElement>;

  // promises
  private confirmResolver: (value?: string[] | PromiseLike<string[]>) => void;

  constructor() {
    this.modal = $("#input-modal");

    this.nameInput = $("#nickname");
    this.urlInput = $("#server-url");

    $("#btn-confirm-nickname").on("click", () =>
      this.confirmResolver?.([
        this.nameInput.val() as string,
        this.urlInput.val() as string,
      ])
    );
    $("#btn-cancel-nickname").on("click", () => this.confirmResolver?.(null));

    this.modal.on("transitionend", () => {
      if (this.modal[0].dataset.toggle === "hide") {
        this.modal.css("display", "none");
      }
    });
  }

  public ask(defaultName: string, defaultUrl: string): Promise<string[]> {
    this.modal.css("display", "flex");
    this.nameInput.val(defaultName);
    this.urlInput.val(defaultUrl);

    setTimeout(() => {
      this.modal[0].dataset.toggle = "open";
    });
    return new Promise(resolve => {
      this.confirmResolver = resolve;
    });
  }

  public hideModal(): void {
    this.modal[0].dataset.toggle = "hide";
  }
}
