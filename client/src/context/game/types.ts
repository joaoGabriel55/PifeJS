import { TCard } from "../../components/card/CardDisplay";

export type GameState = {
  playerHand: TCard[];
  deckSize: number;
  discardPile: TCard[];
  opponentHand: TCard[];
  userData: MatchMeta;
};

export type MatchMeta = {
  userName: string;
  currentPlayer: string;
};

export type GameAction =
  | {
      type: "SWAP_PLAYER_CARDS";
      payload: { fromId: string; toId: string };
    }
  | {
      type: "DRAW_FROM_DECK";
      payload: { deckCardId: string; playerCardId: string };
    }
  | {
      type: "DRAW_FROM_DISCARD";
      payload: { discardCardId: string; playerCardId: string };
    }
  | { type: "DISCARD_FROM_DECK"; payload: { deckCardId: string } };
