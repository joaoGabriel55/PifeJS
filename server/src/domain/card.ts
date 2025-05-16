import { z } from "zod";

const Suits = z.enum(["SPADES", "HEARTS", "DIAMONDS", "CLUBS"]);
const Values = z.enum([
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
]);

export const CardSchema = z.object({
  suit: Suits,
  value: Values,
});

export type Card = z.infer<typeof CardSchema>;
export type Suits = z.infer<typeof Suits>;
export type Values = z.infer<typeof Values>;
