import BoardChangedEvent from "@event/BoardChangedEvent";
import ControlEvent from "@event/ControlEvent";
import { GameOverEvent } from "@event/emptyEvents";
import eventDispatcher from "@event/eventDispatcher";
import IndicatorChangedEvent from "@event/IndicatorChangedEvent";
import PlaceEvent from "@event/PlaceEvent";
import PlayerRotateEvent from "@event/PlayerRotateEvent";
import PutMessageEvent from "@event/PutMessageEvent";
import RetractionEvent from "@event/RetractionEvent";
import RoomUpdatedEvent from "@event/RoomUpdatedEvent";
import SendMessageEvent from "@event/SendMessageEvent";
import Chess from "@model/base/Chess";
import Message from "@model/base/Message";
import Player from "@model/base/Player";
import Room from "@model/base/Room";
import ChessboardMessage from "@model/ws/ChessboardMessage";
import InstantMessage from "@model/ws/InstantMessage";
import PlaceMessage from "@model/ws/PlaceMessage";
import RetractionDealingMessage from "@model/ws/RetractionDealingMessage";
import RetractionPreviewMessage from "@model/ws/RetractionPreview";
import RetractionRequestMessage from "@model/ws/RetractionRequestMessage";
import RetractionResultMessage from "@model/ws/RetractionResultMessage";
import G from "@util/global";
import AbstractStage from "@view/AbstractStage";
import ControlPanel from "@view/ControlPanel";
import MessageArea from "@view/MessageArea";

export default class GameController {
  private stage: AbstractStage = G.stage
  private controlPanel: ControlPanel = G.controlPanel
  private messageArea: MessageArea = G.messageArea
  private isMyTurn: boolean
  private boardDirty: boolean = false

  constructor() {
    eventDispatcher.listen("indicatorChanged", this.chessBoardIndicatorChanged)
    eventDispatcher.listen("boardChanged", this.chessBoardChanged)
    eventDispatcher.listen("playerRotate", this.playerRotated)
    eventDispatcher.listen("place", this.placeChess)
    eventDispatcher.listen("control", this.handleControl)
    eventDispatcher.listen("sendMessage", this.handleSendMessage)
    eventDispatcher.listen("putMessage", this.handlePutMessage)
    eventDispatcher.listen("retraction", this.handleRetractionRequest)
    eventDispatcher.listen("gameOver", this.handleGameOver)
  }

  public startGame(room: Room) {
    this.stage.enterGame()
    this.stage.boardDisabled = room.isGameOver
    this.controlPanel.openPanel()
      .then(() => {
        this.controlPanel.players = room.players.map(player =>
          player.name === G.me.name ?
            new Player(player.name + "(您)", player.online, player.chessType) :
            player
        )
        this.boardDirty = true
        G.WSClient.send(new ChessboardMessage())
      })
  }

  public endGame() {
    this.stage.leaveGame().then(() => {
      G.roomController.backRoom()
    })
    this.controlPanel.hidePanel()
    setTimeout(() => {
      this.messageArea.clear()
    }, 300);
  }

  private chessBoardIndicatorChanged = (e: IndicatorChangedEvent): void => {
    this.stage.setIndicator(e.detail.x, e.detail.y, !this.isMyTurn)
  }

  private placeChess = (e: PlaceEvent): void => {
    G.WSClient.send(new PlaceMessage(
      new Chess(e.detail.x, e.detail.y, G.myChessType)
    ))
  }

  private chessBoardChanged = (e: BoardChangedEvent): void => {
    switch (e.detail.type) {
      case "load":
        if (!this.boardDirty) break
        this.stage.removeAllChesses()
        this.boardDirty = false
      case "add":
        e.detail.chesses.forEach(chess => {
          this.stage.addChess(chess)
        })
        break
      case "remove":
        e.detail.chesses.forEach(chess => {
          this.stage.removeChess(chess.x, chess.y)
        })
        this.controlPanel.retracting = false
    }
  }

  private playerRotated = (e: PlayerRotateEvent): void => {
    this.isMyTurn = e.detail.isMeNow
    this.controlPanel.currentChess = e.detail.isMeNow ? G.myChessType : (3 - G.myChessType)
    this.stage.boardDisabled = !e.detail.isMeNow
  }

  private handleControl = (e: ControlEvent): void => {
    switch (e.detail.type) {
      case "retract":
        G.WSClient.send(new RetractionPreviewMessage()).then(msg => {
          if (msg instanceof RetractionPreviewMessage) {
            msg.playLogs.forEach(log => {
              this.stage.highlightChess(log.chess.x, log.chess.y)
            })
          }
        })
        this.controlPanel.showConfirm("确定向对手请求悔棋吗？", "放弃", "确定").then(confirmed => {
          this.controlPanel.hideConfirm()
          if (confirmed) {
            this.controlPanel.retracting = true
            this.stage.boardDisabled = true
            G.WSClient.send(new RetractionRequestMessage()).then(msg => {
              this.controlPanel.retracting = false
              this.stage.boardDisabled = false
              this.stage.unhighlightAllChesses()
            })
          }
          else {
            this.stage.unhighlightAllChesses()
          }
        })
        break
      case "leave":
        this.endGame()
        G.currentRoom = null
        G.WSClient.disconnect()
        break
    }
  }

  private handleSendMessage = (e: SendMessageEvent): void => {
    G.WSClient.send(new InstantMessage(e.detail.content))
    this.messageArea.appendMessage(new Message("IM", e.detail.content, true))
  }

  private handlePutMessage = (e: PutMessageEvent): void => {
    this.messageArea.appendMessage(e.detail.content)  
  }

  private handleRetractionRequest = (e: RetractionEvent): void => {
    e.detail.retraction.retractedLog.forEach(log => {
      this.stage.highlightChess(log.chess.x, log.chess.y)
    })
    this.controlPanel.showConfirm("对方请求悔棋，是否同意？", "拒绝", "同意").then(confirmed => {
      this.controlPanel.hideConfirm()
      G.WSClient.send(new RetractionDealingMessage(confirmed))
      this.stage.unhighlightAllChesses()
    })
  }

  private handleGameOver = (e: GameOverEvent): void => {
    this.stage.boardDisabled = true
    alert("游戏结束！")
  }
}