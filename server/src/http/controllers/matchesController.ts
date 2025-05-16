import { Request, Response } from "express";
import { MatchService } from "../../services/matchService.js";
import { RoomsRepository } from "../../repositories/roomsRepository.js";
import { MatchesRepository } from "../../repositories/matchesRepository.js";
import { RoundsRepository } from "../../repositories/roundsRepository.js";
import { NotFoundError } from "../../errors/notFoundError.js";
import { ValidationError } from "../../errors/validationError.js";

export const makeMatchesController = (
  roomsRepository: RoomsRepository,
  matchesRepository: MatchesRepository,
  roundsRepository: RoundsRepository
) => {
  const create = async (req: Request, res: Response) => {
    const matchesService = new MatchService(
      roomsRepository,
      matchesRepository,
      roundsRepository
    );

    try {
      const roomId = req.params.roomId;
      const match = await matchesService.start(roomId);

      res.status(201).json(match);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message, error: error.issues });
      } else if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };

  return {
    create,
  };
};
