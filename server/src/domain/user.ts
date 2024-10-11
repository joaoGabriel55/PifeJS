import { z } from "zod";

const UserSchema = z.object({
  id: z
    .string({ message: "Id is missing" })
    .uuid({ message: "Invalid format" }),
  name: z.string({message: "Name must be a string"}).optional(),
  email: z
    .string({ message: "Email is missing" })
    .email({ message: "Email is invalid" }),
});

export const CreateUserDtoSchema = UserSchema.omit({ id: true });
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = UserSchema.partial().strict();
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

export type User = z.infer<typeof UserSchema>;
