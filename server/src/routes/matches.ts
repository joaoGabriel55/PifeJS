import { Router } from "express";
import { Repositories } from "../shared/types.js";
import { makeMatchesController } from "../http/controllers/matchesController.js";

export function matchesRoutes({
  matchesRepository,
  roomsRepository,
  roundsRepository,
}: Repositories) {
  const router = Router();
  const MatchesController = makeMatchesController(
    new roomsRepository(),
    new matchesRepository(),
    new roundsRepository()
  );

  router.post("/", MatchesController.create);

  return router;
}
