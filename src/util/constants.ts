import { Vector3 } from "three"

export const boardStyles = [
  {
    size: 10,
    color: "#0077cb",
    positionZ: -300,
    cameraPosition: new Vector3(0, -100, -500)
  }, {
    size: 15,
    color: "#af7900",
    positionZ: -500,
    cameraPosition: new Vector3(0, -100, -500)
  }, {
    size: 20,
    color: "#cb002f",
    positionZ: -1500,
    cameraPosition: new Vector3(50, -200, -1150)
  }
]

export const primaryColor = "#1878a8"
export const primaryDarkColor = "#092f42"

export const matrixGap = 20
export const matrixLineWidth = 2
export const boardPadding = 40
export const boardRadius = 15
export const indicatorOverflow = 20
export const pieceRadius = 10

export const blackPieceColor = 0x333333
export const whitePieceColor = 0xffffff

export enum ErrorDetail {
  // WebSocket握手阶段发生错误
  HeaderNotSet = "未指定WS-Username或WS-GameName",
  SizeNotAnInteger = "WS-ChessboardSize不是整数",
  DuplicatedUsername = "username已存在，请更换",
  
  // 房间操作发生错误
  RoomNotFound = "未找到房间名字",
  RoomIdentityOccupied = "已加入该房间",
  RoomIsFull = "房间已满",
  NoRoomToLeave = "该用户不在任何游戏中",

  // 悔棋或下棋发生错误
  NotYourTurn = "当前不是您的会合",
  ChessAlreadySet = "该位置已有棋子",
  ChessOutOfRange = "越界",
  UnprocessedRetraction = "目前仍有悔棋请求没有被处理",

  // 悔棋以及处理悔棋发生错误
  NoChessToRetract = "您还未落子",
  NoRetractionToBeProcessed = "目前没有悔棋请求需要处理",
  RetractionIsYours = "您不能直接同意自己的悔棋请求",

  // 执行游戏操作发生错误
  GameNotStarted = "游戏暂未开始",
  GameAlreadyEnded = "游戏已结束",

  // WebSocket通信发生错误
  UnknownMessageType = "type not exist",
  MessageIsNotAJson = "数据非法",
  CommunicationTimeout = "timeout",
}