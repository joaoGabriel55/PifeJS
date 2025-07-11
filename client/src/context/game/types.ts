import { TCard } from "../../components/card/CardDisplay";

export type GameState = {
  deckSize: number;
  discardPile: TCard[];
  currentPlayer: string;
  hand: TCard[];
  connectedPlayerId: string;
  matchId: string;
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
      type: "UPDATE_GAME_STATE";
      payload: GameState;
    };
