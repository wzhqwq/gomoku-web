import Setting from "../model/local/Setting"
import G from "../util/global"
import UserInput from "../view/UserInput"
import RoomController from "./RoomController"

export default class AppController {
  // views
  private userInput: UserInput = new UserInput()

  public startApp(): void {
    let { nickname, serverUrl } = G.setting
    this.userInput.ask(nickname, serverUrl).then(settings => {
      if (settings) {
        if (settings[1].match(/\/$/)) {
          settings[1] = settings[1].slice(0, -1)
        }
        G.setting = new Setting(settings[0], settings[1])
        G.setting.save()
        let roomController = new RoomController()
        roomController.startRoom()
        this.userInput.hideModal()
      }
      else {
        window.close()
      }
    })
  }
}