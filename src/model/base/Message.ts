export default class Message {
  constructor (
    public type: "system" | "IM",
    public content: string,
    public isMine: boolean,
  ) {}
}