import { Request, Response } from "express";
import UsersRepository from "../../repositories/usersRepository.js";
import { CreateRoomDto } from "../../domain/room.js";
import { RoomsService } from "../../services/roomsService.js";
import { NotFoundError } from "../../errors/notFoundError.js";
import { ValidationError } from "../../errors/validationError.js";
import { RoomsRepository } from "../../repositories/roomsRepository.js";

export const makeRoomsController = (
  usersRepository: UsersRepository,
  roomsRepository: RoomsRepository
) => {
  const index = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const rooms = await roomsService.getAll();

      res.json(rooms);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  };

  const show = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const room = await roomsService.getById(req.params.id);

      res.json(room);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({ message: e.message });
      } else if (e instanceof Error) {
        res.status(500).json({ message: e.message });
      }
    }
  };

  const create = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const roomDto: CreateRoomDto = req.body;

      const room = await roomsService.create(roomDto);

      res.status(201).json(room);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const addPlayer = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const roomId = req.params.id;
      const playerId = req.params.playerId;

      const room = await roomsService.addPlayer(playerId, roomId);

      res.json(room);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof ValidationError) {
        res.status(422).json({ message: error.message, errors: error.issues });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const removePlayer = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const roomId = req.params.id;
      const playerId = req.params.playerId;

      const room = await roomsService.removePlayer(playerId, roomId);

      res.json(room);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const update = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const roomId = req.params.id;
      const roomData = req.body;

      const room = await roomsService.update(roomId, roomData);

      res.json(room);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  const destroy = async (req: Request, res: Response) => {
    const roomsService = new RoomsService(roomsRepository, usersRepository);

    try {
      const roomId = req.params.id;

      await roomsService.delete(roomId);

      res.sendStatus(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
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
    addPlayer,
    removePlayer,
    update,
    destroy,
  };
};
