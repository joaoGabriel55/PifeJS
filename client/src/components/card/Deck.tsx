import { Card } from "./Card";
import "./Deck.css";
import { useGameState } from "../../context/game/GameContext";
import { useDeck } from "../../hooks/useDeck";

type DeckProps = {
  deckSize: number;
};

export function Deck({ deckSize }: DeckProps) {
  // const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const state = useGameState();
  const { topCard, flipCard } = useDeck();

  const cannotPlay = state.userData.userName !== state.userData.currentPlayer;

  return (
    <div className="deck-wrapper">
      {Array.from({ length: deckSize }).map((_, index) => {
        const isTopCard = index === deckSize - 1;
        // const isFlipped = flippedCardId === card.id;
        // const isDraggable = isTopCard && isFlipped;

        const handleFlip = () => {
          if (cannotPlay) {
            return;
          }

          flipCard();

          // if (isTopCard && !isFlipped) {
          //   setFlippedCardId(card.id);
          // }
        };

        if (topCard) {
          return (
            <div
              key={index}
              className={"deck-card-wrapper top-card"}
              style={{ transform: `translate(${index * -5}px, 0)` }}
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
          );
        }

        return (
          <div
            key={index}
            className={`deck-card-wrapper ${isTopCard ? "top-card" : ""} ${
              cannotPlay ? "blocked" : ""
            }`}
            style={{ transform: `translate(${index * -5}px, 0)` }}
          >
            <Card
              card={{ isFaceDown: true, id: index.toString(), source: "DECK" }}
              onClick={handleFlip}
            />
          </div>
        );
      })}
    </div>
  );
}
