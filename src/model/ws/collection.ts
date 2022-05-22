import ChessboardMessage from "./ChessboardMessage";
import ErrorMessage from "./ErrorMessage";
import GameOverMessage from "./GameOverMessage";
import InstantMessage from "./InstantMessage";
import PlaceMessage from "./PlaceMessage";
import RetractionPreviewMessage from "./RetractionPreview";
import RetractionRequestMessage from "./RetractionRequestMessage";
import RetractionResultMessage from "./RetractionResultMessage";
import RoomMessage from "./RoomMessage";

export interface MessageMap {
  chessboard: ChessboardMessage
  error: ErrorMessage
  gameOver: GameOverMessage
  IM: InstantMessage
  place: PlaceMessage
  retractionPreview: RetractionPreviewMessage
  retractionRequest: RetractionRequestMessage
  retractionResult: RetractionResultMessage
  gameInfo: RoomMessage
}

export type MessageTypes = keyof MessageMap