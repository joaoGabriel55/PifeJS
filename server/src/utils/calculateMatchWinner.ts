import { Card } from "../domain/card.js";

const isWinner = (cards: Card[]): boolean => {
  const valueMap: { [key: string]: number } = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 1
  };

  const newCards = cards.map((card) => ({
    value: valueMap[card.value],
    suit: card.suit,
  }));

  const isSequence = (cards: { value: number; suit: string }[]): boolean => {
    const values = cards.map((card) => card.value).sort((a, b) => a - b);

    return (
      (values[0] + 1 === values[1] && values[1] + 1 === values[2]) ||
      (values.includes(1) && values.includes(2) && values.includes(3)) || // A, 2, 3
      (values.includes(12) && values.includes(13) && values.includes(1)) // Q, K, A
    );
  };

  const isSameValue = (cards: { value: number; suit: string }[]): boolean => {
    return (
      cards[0].value === cards[1].value &&
      cards[1].value === cards[2].value &&
      new Set(cards.map((card) => card.suit)).size === 3
    );
  };

  const findSets = (cards: { value: number; suit: string }[], setsFound: number): boolean => {
    if (setsFound === 3) return true;
    if (cards.length < 3) return false;

    for (let i = 0; i < cards.length - 2; i++) {
      for (let j = i + 1; j < cards.length - 1; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          const selectedCards = [cards[i], cards[j], cards[k]];
          if (isSameValue(selectedCards) || isSequence(selectedCards)) {
            const remainingCards = cards.filter(
              (_, index) => index !== i && index !== j && index !== k
            );
            if (findSets(remainingCards, setsFound + 1)) return true;
          }
        }
      }
    }
    return false;
  };

  return findSets(newCards, 0);
};

export { isWinner };
