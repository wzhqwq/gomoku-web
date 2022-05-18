import eventDispatcher from '@event/eventDispatcher'
import SendMessageEvent from '@event/SendMessageEvent'
import * as $ from 'jquery'

export default class MessageArea {
  private sendButton: JQuery<HTMLButtonElement>
  private messageTextArea: JQuery<HTMLTextAreaElement>
  private messageBox: JQuery<HTMLDivElement>

  constructor() {
    this.sendButton = $('#btn-send')
    this.messageTextArea = $('#message-input')
    this.messageBox = $('#message-box')

    this.sendButton.on("click", () => eventDispatcher.dispatch("sendMessage", new SendMessageEvent(
      this.messageTextArea.val() as string
    )))
  }

  public appendMessage(content: string, isMine: boolean) {
    const message = $(`<div class="message ${isMine ? 'mine' : ''}">${content}</div>`)
    this.messageBox.append(message)
    this.messageBox.scrollTop(this.messageBox.prop("scrollHeight"))
  }
}