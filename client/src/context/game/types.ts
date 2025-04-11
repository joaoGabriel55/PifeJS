import { TCard } from "../../components/card/CardDisplay";

export type GameState = {
  playerHand: TCard[];
  deck: TCard[];
  discardPile: TCard[];
  opponentHand: TCard[];
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
