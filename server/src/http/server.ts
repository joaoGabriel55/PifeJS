import express from "express";
import UsersRepository from "../repositories/usersRepository.js";
import { usersRoutes } from "../routes/users.js";
import { roomsRoutes } from "../routes/rooms.js";
import { RoomsRepository } from "../repositories/roomsRepository.js";
import { MatchesRepository } from "../repositories/matchesRepository.js";
import { RoundsRepository } from "../repositories/roundsRepository.js";
import { matchesRoutes } from "../routes/matches.js";
import cors from "cors";

export const repositories = {
  usersRepository: UsersRepository,
  roomsRepository: RoomsRepository,
  matchesRepository: MatchesRepository,
  roundsRepository: RoundsRepository,
} as const;

const makeServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use("/users", usersRoutes(repositories));

  app.use("/rooms", roomsRoutes(repositories));

  app.use("/matches", matchesRoutes(repositories));

  return app;
};

export { makeServer };
