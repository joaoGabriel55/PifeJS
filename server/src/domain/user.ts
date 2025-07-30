import { z } from "zod";
import { UuidSchema } from "./uuid.js";

export const UserSchema = z.object({
  id: UuidSchema,
  name: z.string({message: "Name must be a string"}).optional(),
  email: z
    .string({ message: "Email is missing" })
    .email({ message: "Email is invalid" }),
  encryptedPassword: z
    .string({ message: "Password is missing" })
});

export const CreateUserDtoSchema = UserSchema.omit({ id: true, encryptedPassword: true }).strict().extend({
  password: z.string({ message: "Password is missing" })});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = UserSchema.partial().strict();
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export type User = z.infer<typeof UserSchema>;
