import * as $ from "jquery";
import Player from "../model/base/Player";
import Collapse from "./Collapse";

export default class ControlPanel {
  // panels
  private playerPanels: JQuery<HTMLDivElement>[];
  private confirmBody: JQuery<HTMLDivElement>;

  // buttons
  private confirmButton: JQuery<HTMLButtonElement>;
  private cancelButton: JQuery<HTMLButtonElement>;
  private abortButton: JQuery<HTMLButtonElement>;
  private retractButton: JQuery<HTMLButtonElement>;

  // collapse
  private normalCollapse: Collapse;
  private confirmCollapse: Collapse;

  // promises
  private confirmResolver: (value?: boolean | PromiseLike<boolean>) => void;

  constructor() {
    this.playerPanels = [$("#player-1"), $("#player-2")];
    this.confirmBody = $("#confirm-message");
    this.confirmButton = $("#btn-confirm");
    this.cancelButton = $("#btn-cancel");
    this.abortButton = $("#btn-abort");
    this.retractButton = $("#btn-retract");

    this.normalCollapse = new Collapse("#normal-collapse");
    this.confirmCollapse = new Collapse("#confirm-collapse");

    this.confirmButton.on("click", () => this.confirmResolver?.(true));
    this.cancelButton.on("click", () => this.confirmResolver?.(false));
  }

  public showConfirm(
    message: string,
    cancelText: string,
    confirmText: string
  ): Promise<boolean> {
    this.confirmBody.text(message);
    this.cancelButton.text(cancelText);
    this.confirmButton.text(confirmText);
    this.normalCollapse.collapse();
    this.confirmCollapse.open();

    return new Promise(resolve => {
      this.confirmResolver = resolve;
    });
  }

  public hideConfirm(): void {
    this.normalCollapse.open();
    this.confirmCollapse.collapse();
  }

  public set players(players: Player[]) {
    players = players.sort((a, b) => a.chessType - b.chessType);
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const panel = this.playerPanels[i];
      panel.find(".player-name").text(player.name);
      panel[0].dataset.position =
        i + 1 === this.currentChess ? "origin" : "half-right";
    }
  }

  public set currentChess(chess: number) {
    this.playerPanels.forEach((panel, index) => {
      panel[0].dataset.position = index + 1 === chess ? "origin" : "half-right";
    });
  }

  public bindAbort(handler: () => void): void {
    this.abortButton.on("click", handler);
  }

  public bindRetract(handler: () => void): void {
    this.retractButton.on("click", handler);
  }

  public set retracting(value: boolean) {
    this.retractButton[0].disabled = value;
    this.retractButton.text(value ? "等待对方同意悔棋…" : "悔棋");
  }
}
