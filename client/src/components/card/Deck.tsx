import { Card } from "./Card";
import "./Deck.css";
import { useGameState } from "../../context/game/GameContext";
import { useDeck } from "../../hooks/useDeck";
import { useEffect } from "react";
import eventBus from "../../lib/eventBus";

type DeckProps = {
  deckSize: number;
};

export function Deck({ deckSize }: DeckProps) {
  const state = useGameState();
  const { topCard, flipCard, removeTopCard } = useDeck(state.matchId);

  useEffect(() => {
    eventBus.on("removeTopCard", removeTopCard);

    return () => {
      eventBus.off("removeTopCard", removeTopCard);
    };
  }, []);


  const cannotPlay = state.currentPlayer !== state.connectedPlayerId;

  const handleFlip = async () => {
    if (cannotPlay) {
      return;
    }

    await flipCard();
  };

  return (
    <div className="deck-wrapper">
      {Array.from({ length: deckSize }).map((_, index) => {
        return (
          <div
            key={index}
            className={`deck-card-wrapper ${cannotPlay ? "blocked" : ""}`}
            style={{ transform: `translate(${index * -5}px, 0)` }}
          >
            <Card
              card={{ isFaceDown: true, id: index.toString(), source: "DECK" }}
              onClick={handleFlip}
            />
          </div>
        );
      })}

      {topCard !== undefined ? (
        <div
          className={"deck-card-wrapper top-card"}
          style={{ transform: `translate(${state.deckSize * -5}px, 0)` }}
        >
          <Card
            card={{
              ...topCard,
              isFaceDown: false,
            }}
            onClick={handleFlip}
            isDraggable
          />
        </div>
      ) : null}
    </div>
  );
}
