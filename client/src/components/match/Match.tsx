import { useState } from "react";
import { useRound } from "../../hooks/useRound";
import { Card } from "../card/Card";
import "./Match.css";

export function Match() {
  const { round } = useRound();
  const [playerHand] = useState(round.hands[0].hand);

  return (
    <div className="board">
      <section className="player-hand">
        {playerHand.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
}
