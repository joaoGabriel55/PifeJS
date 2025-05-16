import { z } from "zod";
import { RoomSchema } from "./room.js";
import { UserSchema } from "./user.js";
import { Round, RoundSchema } from "./round.js";
import { UuidSchema } from "./uuid.js";

export const PLAYER_HAND_SIZE = 9;

const MatchState = z.enum(["ONGOING", "FINISHED", "CANCELED"]);

const BaseMatchSchema = z.object({
  id: UuidSchema,
  room: RoomSchema,
  state: MatchState.default("ONGOING").optional(),
  winner: UserSchema.optional(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
});

export type Match = z.infer<typeof BaseMatchSchema> & {
  rounds: Round[];
};

export const MatchSchema: z.ZodType<Match> = BaseMatchSchema.extend({
  rounds: z.lazy(() => RoundSchema.array()),
});

const CreateMatchSchema = BaseMatchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  room: UuidSchema,
  rounds: z.array(UuidSchema),
});

export type CreateMatchDto = z.infer<typeof CreateMatchSchema>;
