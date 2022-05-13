import { boardStyles } from "@util/constants"
import * as $ from "jquery"
import Modal from "./Modal"

export type RoomInfoType = {
  roomName: string
  size: number
}

export default class UserInput extends Modal {
  private roomInput: JQuery<HTMLInputElement>
  private boardSizeRadios: JQuery<HTMLInputElement>[]

  // promises
  private confirmResolver: (value?: RoomInfoType | PromiseLike<RoomInfoType>) => void

  constructor() {
    super("#new-room-modal")
    this.roomInput = $("#room-name")
    this.boardSizeRadios = boardStyles.map(({ size }) =>
      $(`#board-size-${size}`)
    )

    $("#btn-confirm-new-room").on("click", () =>
      this.confirmResolver?.({
        roomName: this.roomInput.val() as string,
        size: this.boardSizeRadios.find(radio => radio.prop("checked")).val() as number,
      })
    )
    $("#btn-cancel-new-room").on("click", () => this.confirmResolver?.(null))
  }

  public ask(): Promise<RoomInfoType> {
    this.roomInput.val("")
    this.boardSizeRadios[0].prop("checked", true)
    
    this.showModal()

    return new Promise(resolve => {
      this.confirmResolver = resolve
    })
  }
}
