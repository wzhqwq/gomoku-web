import eventDispatcher from '@event/eventDispatcher'
import SendMessageEvent from '@event/SendMessageEvent'
import Message from '@model/base/Message'
import * as $ from 'jquery'

export default class MessageArea {
  private sendButton: JQuery<HTMLButtonElement>
  private messageTextArea: JQuery<HTMLTextAreaElement>
  private messageBox: JQuery<HTMLDivElement>

  constructor() {
    this.sendButton = $('#btn-send')
    this.messageTextArea = $('#message-input')
    this.messageBox = $('#message-box')

    this.sendButton.on("click", () => {
      eventDispatcher.dispatch("sendMessage", new SendMessageEvent(
        this.messageTextArea.val() as string
      ))
      this.messageTextArea.val('')
    })
  }

  public appendMessage(message: Message) {
    this.messageBox.append($(`<div class="message ${
      message.type === "IM" ? (message.isMine ? 'mine' : 'opponent') : "system"
    }">${message.content}</div>`))
    this.messageBox.scrollTop(this.messageBox.prop("scrollHeight"))
  }

  public clear() {
    this.messageBox.empty()
  }
}