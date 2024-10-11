import { Request, Response } from "express";
import { UserService } from "../../services/usersService.js";
import { NotFoundError } from "../../errors/notFoundError.js";
import { CreateUserDto, UpdateUserDto } from "../../domain/user.js";
import UsersRepository from "../../repositories/usersRepository.js";

export const makeUsersController = (usersRepository: UsersRepository) => {
  const index = async (req: Request, res: Response) => {
    const usersService = new UserService(usersRepository);

    try {
      const users = await usersService.getAll();

      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  };

  const show = async (req: Request, res: Response) => {
    const usersService = new UserService(usersRepository);

    try {
      const userId = req.params.id;

      const user = await usersService.getById(userId);

      res.json(user);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({ error: e.message });
      } else if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      }
    }
  };

  const create = async (req: Request, res: Response) => {
    const usersService = new UserService(usersRepository);

    try {
      const userDto: CreateUserDto = req.body;

      const result = await usersService.create(userDto);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const update = async (req: Request, res: Response) => {
    const usersService = new UserService(usersRepository);

    try {
      const userId = req.params.id;
      const userDto: UpdateUserDto = req.body;

      const result = await usersService.update(userId, userDto);

      res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const destroy = async (req: Request, res: Response) => {
    const usersService = new UserService(usersRepository);

    try {
      const userId = req.params.id;

      await usersService.delete(userId);

      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  return {
    index,
    show,
    create,
    update,
    destroy,
  };
};
