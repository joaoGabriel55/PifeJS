import { z } from "zod";
import { UserSchema } from "./user.js";

export const MAX_PLAYERS = 4;

const RoomSchema = z.object({
  id: z
    .string({ message: "Id is missing" })
    .uuid({ message: "Invalid format" }),
  name: z.string({ message: "Name must be a string" }).optional(),
  owner: UserSchema,
  players: z.array(UserSchema).max(MAX_PLAYERS, { message: "Room is full" }),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
});

export const CreateRoomSchema = RoomSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  owner: UserSchema.pick({ id: true }),
  players: z.array(UserSchema.shape.id).max(MAX_PLAYERS),
});
export type CreateRoomDto = z.infer<typeof CreateRoomSchema>;

export const UpdateRoomSchema = RoomSchema.partial().strict().omit({
  owner: true,
  players: true,
});

export type UpdateRoomDto = z.infer<typeof UpdateRoomSchema>;

export type Room = z.infer<typeof RoomSchema>;
