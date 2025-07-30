import { Router } from "express";
import { Repositories } from "../shared/types.js";
import { makeRoomsController } from "../http/controllers/roomsController.js";
import { CreateRoomSchema, UpdateRoomSchema } from "../domain/room.js";
import { validateSchema } from "../http/middleware/validationMiddleware.js";
import { makeMatchesController } from "../http/controllers/matchesController.js";
import { MatchesRepository } from "../repositories/matchesRepository.js";

export function roomsRoutes({
  roomsRepository,
  usersRepository,
  matchesRepository,
  roundsRepository
}: Repositories) {
  const router = Router();
  const RoomsController = makeRoomsController(
    new usersRepository(),
    new roomsRepository()
  );
  const MatchesController = makeMatchesController(
    new roomsRepository(),
    new matchesRepository(),
    new roundsRepository()
  )

  router.get("/", RoomsController.index);

  router.get("/:id", RoomsController.show);

  router.get("/:roomId/matches", MatchesController.index)

  router.post("/", validateSchema(CreateRoomSchema), RoomsController.create);

  router.patch(
    "/:id/players/:playerId/add",
    validateSchema(UpdateRoomSchema),
    RoomsController.addPlayer
  );

  router.patch(
    "/:id/players/:playerId/remove",
    validateSchema(UpdateRoomSchema),
    RoomsController.removePlayer
  );

  router.patch(
    "/:id",
    validateSchema(UpdateRoomSchema),
    RoomsController.update
  );

  router.delete("/:id", RoomsController.destroy);

  return router;
}
