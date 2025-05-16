import { Router } from "express";
import { makeUsersController } from "../http/controllers/usersController.js";
import { validateSchema } from "../http/middleware/validationMiddleware.js";
import { CreateUserDtoSchema, UpdateUserDtoSchema } from "../domain/user.js";
import { Repositories } from "../shared/types.js";

export function usersRoutes({ usersRepository }: Repositories) {
  const router = Router();
  const UsersController = makeUsersController(new usersRepository());

  router.get("/", UsersController.index);

  router.get("/:id", UsersController.show);

  router.post("/", validateSchema(CreateUserDtoSchema), UsersController.create);

  router.put(
    "/:id",
    validateSchema(UpdateUserDtoSchema),
    UsersController.update
  );

  router.delete("/:id", UsersController.destroy);

  return router;
}
