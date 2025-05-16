import { useState } from "react";
import { TCard } from "../components/card/CardDisplay";

export const useDeck = () => {
  const [topCard, setTopCard] = useState<TCard>();

  const flipCard = async () => {
    const card: TCard = {
      id: "clubs-6",
      source: "DECK",
    };

    setTopCard(card);
  };

  return {
    flipCard,
    topCard,
  };
};
