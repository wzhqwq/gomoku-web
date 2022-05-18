import BoardChangedEvent from "@event/BoardChangedEvent";
import eventDispatcher from "@event/eventDispatcher";
import IndicatorChangedEvent from "@event/IndicatorChangedEvent";
import PlaceEvent from "@event/PlaceEvent";
import PlayerRotateEvent from "@event/PlayerRotateEvent";
import RoomUpdatedEvent from "@event/RoomUpdatedEvent";
import Chess from "@model/base/Chess";
import Room from "@model/base/Room";
import ChessboardMessage from "@model/ws/ChessboardMessage";
import PlaceMessage from "@model/ws/PlaceMessage";
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
    eventDispatcher.listen("playerRotate", this.playerRotated)
    eventDispatcher.listen("place", this.placeChess)
  }

  public startGame(room: Room) {
    this.stage.enterGame()
    this.controlPanel.openPanel()
      .then(() => {
        this.controlPanel.players = room.players
        G.WSClient.send(new ChessboardMessage())
        setTimeout(() => {
          this.stage.addChess(new Chess(18, 18, 1))
          this.stage.addChess(new Chess(8, 8, 2))
        }, 2000)
      })
  }

  public chessBoardIndicatorChanged = (e: IndicatorChangedEvent): void => {
    this.stage.setIndicator(e.detail.x, e.detail.y)
  }

  public placeChess = (e: PlaceEvent): void => {
    G.WSClient.send(new PlaceMessage(
      new Chess(e.detail.x, e.detail.y, G.myChessType)
    ))
  }

  public chessBoardChanged = (e: BoardChangedEvent): void => {
    console.log(e.detail.chesses)
  }

  public playerRotated = (e: PlayerRotateEvent): void => {
    console.log(e.detail.isMeNow)
    this.controlPanel.currentChess = e.detail.isMeNow ? G.myChessType : (3 - G.myChessType)
  }
}