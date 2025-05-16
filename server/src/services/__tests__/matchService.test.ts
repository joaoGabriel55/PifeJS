import {
  MOCK_MATCHES,
  MockMatchesRepository,
} from "../../repositories/__mocks__/mockMatchesRepository.js";
import {
  MOCK_ROOMS,
  MockRoomsRepository,
} from "../../repositories/__mocks__/mockRoomsRepository.js";
import { MockRoundsRepository } from "../../repositories/__mocks__/mockRoundsRepository.js";
import { MOCK_USERS } from "../../repositories/__mocks__/mockUsersRepository.js";
import { MatchService } from "../matchService.js";

describe("MatchService", () => {
  let service: MatchService;
  let mockRoomsRepository: MockRoomsRepository;
  let mockMatchesRepository: MockMatchesRepository;
  let mockRoundsRepository: MockRoundsRepository;

  beforeEach(() => {
    mockRoomsRepository = new MockRoomsRepository();
    mockMatchesRepository = new MockMatchesRepository();
    mockRoundsRepository = new MockRoundsRepository();

    service = new MatchService(
      mockRoomsRepository,
      mockMatchesRepository,
      mockRoundsRepository
    );
  });

  describe("start", () => {
    describe("when the room has at least 2 players", () => {
      beforeEach(() => {
        MOCK_ROOMS[0].players = [MOCK_USERS[0], MOCK_USERS[1]];
        mockRoomsRepository = new MockRoomsRepository(MOCK_ROOMS);
      });

      afterEach(() => {
        MOCK_ROOMS[0].players = [MOCK_USERS[0]];
      });

      it("starts a match", async () => {
        const roomId = MOCK_ROOMS[0].id;

        const match = await service.start(roomId);

        expect(match.id).toEqual(expect.any(String));
      });

      it("the initial state is ONGOING", async () => {
        const roomId = MOCK_ROOMS[0].id;

        const match = await service.start(roomId);

        expect(match.state).toBe("ONGOING");
      });

      it("initializes a round", async () => {
        const roomId = MOCK_ROOMS[0].id;
        const spy = jest.spyOn(service, "initRound");

        await service.start(roomId);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the room has less than 2 players", () => {
      it("throws an error", async () => {
        const roomId = MOCK_ROOMS[0].id;

        expect(service.start(roomId)).rejects.toThrow("Verification error");
      });
    });

    describe("when the room is not found", () => {
      it("throws an error", async () => {
        const roomId = "91f6411e-3553-41cd-b1c9-fa2e65c9a419";

        expect(service.start(roomId)).rejects.toThrow("Room not found");
      });
    });
  });

  describe("initRound", () => {
    it("creates the intial round", async () => {
      const matchId = MOCK_MATCHES[0].id;

      const round = await service.initRound(matchId);

      expect(round).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          match: expect.objectContaining({
            id: matchId,
          }),
          createdAt: expect.any(Date),
        })
      );
    });

    it("sets the correct player as the current player", async () => {
      const matchId = MOCK_MATCHES[0].id;

      const round = await service.initRound(matchId);

      expect(round).toEqual(
        expect.objectContaining({
          currentPlayer: expect.objectContaining({
            id: MOCK_USERS[0].id,
          }),
        })
      );
    });

    it("deals the initial cards to the players", async () => {
      const matchId = MOCK_MATCHES[0].id;

      const round = await service.initRound(matchId);

      expect(round).toEqual(
        expect.objectContaining({
          hands: expect.arrayContaining([
            expect.objectContaining({
              player: expect.objectContaining({
                id: MOCK_USERS[0].id,
              }),
              hand: expect.arrayContaining(Array(9).fill(expect.any(Object))),
            }),
            expect.objectContaining({
              player: expect.objectContaining({
                id: MOCK_USERS[1].id,
              }),
              hand: expect.arrayContaining(Array(9).fill(expect.any(Object))),
            }),
          ]),
        })
      );
    });

    it("creates a shuffled deck", async () => {
      const matchId = MOCK_MATCHES[0].id;

      const round = await service.initRound(matchId);

      expect(round).toEqual(
        expect.objectContaining({
          deck: expect.arrayContaining(Array(34).fill(expect.any(Object))),
        })
      );
    });

    describe("when the match is not found", () => {
      it("throws an error", async () => {
        const matchId = "91f6411e-3553-41cd-b1c9-fa2e65c9a419";

        expect(service.initRound(matchId)).rejects.toThrow("Match not found");
      });
    });
  });
});
