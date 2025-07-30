import { useState } from "react";
import { TCard } from "../components/card/CardDisplay";

export const useDeck = (matchId: string) => {
  const [topCard, setTopCard] = useState<TCard>();

  const flipCard = async () => {
    const response = await fetch(`http://localhost:3000/matches/${matchId}/top-card`);
    const rawCard = await response.json();

    const card: TCard = {
      ...rawCard,
      source: "DECK",
      isFaceDown: false,
      id: rawCard.value + "-" + rawCard.suit,
    };

    setTopCard(card);
  };

  const removeTopCard = () => {
    setTopCard(undefined);
  };

  return {
    flipCard,
    topCard,
    removeTopCard,
  };
};
