import express from "express";
import UsersRepository from "../repositories/usersRepository.js";
import { usersRoutes } from "../routes/users.js";

export const repositories = {
  usersRepository: UsersRepository,
} as const;

const makeServer = () => {
  const app = express();

  app.use(express.json());

  app.use("/users", usersRoutes(repositories));

  return app;
};

export { makeServer };
