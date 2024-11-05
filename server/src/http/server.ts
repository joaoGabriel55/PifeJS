import express from "express";
import UsersRepository from "../repositories/usersRepository.js";
import { usersRoutes } from "../routes/users.js";
import { roomsRoutes } from "../routes/rooms.js";
import { RoomsRepository } from "../repositories/roomsRepository.js";

export const repositories = {
  usersRepository: UsersRepository,
  roomsRepository: RoomsRepository,
} as const;

const makeServer = () => {
  const app = express();

  app.use(express.json());

  app.use("/users", usersRoutes(repositories));

  app.use("/rooms", roomsRoutes(repositories));

  return app;
};

export { makeServer };
