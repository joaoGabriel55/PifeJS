import { z } from "zod";
import { CardSchema } from "./card.js";

export const DECK_SIZE = 52;

export const DeckSchema = z.array(CardSchema).max(DECK_SIZE);
export type Deck = z.infer<typeof DeckSchema>;