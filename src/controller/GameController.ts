import BoardChangedEvent from "@event/BoardChangedEvent";
import eventDispatcher from "@event/eventDispatcher";
import IndicatorChangedEvent from "@event/IndicatorChangedEvent";
import RoomUpdatedEvent from "@event/RoomUpdatedEvent";
import Room from "@model/base/Room";
import ChessboardMessage from "@model/ws/ChessboardMessage";
import G from "@util/global";
import AbstractStage from "@view/AbstractStage";
import ControlPanel from "@view/ControlPanel";
import MessageArea from "@view/MessageArea";

export default class GameController {
  private stage: AbstractStage = G.stage
  private controlPanel: ControlPanel = G.controlPanel
  private messageArea: MessageArea = G.messageArea

  constructor() {
    eventDispatcher.listen("indicatorChanged", this.chessBoardIndicatorChanged)
    eventDispatcher.listen("boardChanged", this.chessBoardChanged)
  }

  public startGame(room: Room) {
    this.stage.enterGame()
    this.controlPanel.openPanel()
      .then(() => {
        this.controlPanel.players = room.players
      })
    G.WSClient.send(new ChessboardMessage())
  }

  public chessBoardIndicatorChanged = (e: IndicatorChangedEvent): void => {
    this.stage.setIndicator(e.detail.x, e.detail.y)
  }

  public chessBoardChanged = (e: BoardChangedEvent): void => {
  }

}