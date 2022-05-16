import * as $ from 'jquery'

export default class MessageArea {
  private sendButton: JQuery<HTMLButtonElement>
  private messageTextArea: JQuery<HTMLTextAreaElement>
  private messageBox: JQuery<HTMLDivElement>

  constructor() {
    this.sendButton = $('#btn-send')
    this.messageTextArea = $('#message-input')
    this.messageBox = $('#message-box')
  }
}