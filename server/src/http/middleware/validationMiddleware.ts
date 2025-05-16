import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Validation error",
          errors: error.errors.map((error) => error.message),
        });
      }

      next(error);
    }
  };
