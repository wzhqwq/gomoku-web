import DoCreateRoomEvent from "@event/DoCreateRoomEvent"
import eventDispatcher from "@event/eventDispatcher"
import { boardStyles } from "@util/constants"
import * as $ from "jquery"
import Modal from "./Modal"

export type RoomInfoType = {
  roomName: string
  size: number
}

export default class NewRoom extends Modal {
  private roomInput: JQuery<HTMLInputElement>
  private boardSizeRadios: JQuery<HTMLInputElement>[]
  private roomHelper: JQuery<HTMLDivElement>

  constructor() {
    super("#new-room-modal")
    this.roomInput = $("#room-name")
    this.roomHelper = $("#room-name-helper")
    this.boardSizeRadios = boardStyles.map(({ size }) =>
      $(`#board-size-${size}`)
    )

    $("#btn-confirm-new-room").on("click", () =>
      eventDispatcher.dispatch("doCreateRoom", new DoCreateRoomEvent({
        roomName: this.roomInput.val() as string,
        size: this.boardSizeRadios.find(radio => radio.prop("checked")).val() as number,
      }))
    )
    $("#btn-cancel-new-room").on("click", () => eventDispatcher.dispatch("doCreateRoom", null))
    this.roomHelper.on("animationend", () => this.roomHelper.removeClass("shake"))
  }

  public ask(): void {
    this.roomInput.val("")
    this.boardSizeRadios[0].prop("checked", true)
    
    this.showModal()
  }

  public showError(error: string) {
    this.roomHelper.text(error)
    this.roomHelper.addClass(["has-error", "shake"])
  }

  public hideError() {
    this.roomHelper.removeClass("has-error")
  }
}
