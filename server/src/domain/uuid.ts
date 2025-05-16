import { z } from "zod";

export const UuidSchema = z
  .string({ message: "Id is missing" })
  .uuid({ message: "Invalid format" });
