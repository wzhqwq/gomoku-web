export default class Setting {
  nickname: string = ""
  serverUrl: string = ""

  constructor(nickname: string, serverUrl: string) {
    this.nickname = nickname
    this.serverUrl = serverUrl
  }

  public save(): void {
    localStorage.setItem("nickname", this.nickname)
    localStorage.setItem("serverUrl", this.serverUrl)
  }
}