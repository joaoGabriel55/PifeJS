import { z } from "zod";
import { CardSchema } from "./card.js";
import { UserSchema } from "./user.js";
import { DeckSchema } from "./deck.js";
import { Match, MatchSchema, PLAYER_HAND_SIZE } from "./match.js";
import { UuidSchema } from "./uuid.js";

const PlayerActions = z.enum(["DRAW", "DISCARD"]);

const BaseRoundSchema = z.object({
  id: UuidSchema,
  playerAction: PlayerActions.optional(),
  deck: DeckSchema,
  discardPile: z.array(CardSchema).default([]).optional(),
  currentPlayer: UserSchema,
  hands: z.array(
    z.object({
      player: UserSchema,
      hand: z.array(CardSchema).max(9),
    })
  ),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
});

export type Round = z.infer<typeof BaseRoundSchema> & {
  match: Match;
};

export const RoundSchema: z.ZodType<Round> = BaseRoundSchema.extend({
  match: z.lazy(() => MatchSchema),
});

const CreateRoundSchema = BaseRoundSchema.omit({
  id: true,
  updatedAt: true,
  currentPlayer: true,
}).extend({
  hands: z.array(
    z.object({
      player: UserSchema.pick({ id: true }),
      hand: z.array(CardSchema),
    })
  ),
  match: UuidSchema,
});

export type CreateRoundDto = z.infer<typeof CreateRoundSchema>;
