import { CreateRoomDto, MAX_PLAYERS } from "../../domain/room.js";
import { NotFoundError } from "../../errors/notFoundError.js";
import { ValidationError } from "../../errors/validationError.js";
import {
  MOCK_ROOMS,
  MockRoomsRepository,
} from "../../repositories/__mocks__/mockRoomsRepository.js";
import {
  MOCK_USERS,
  MockUsersRepository,
} from "../../repositories/__mocks__/mockUsersRepository.js";
import { RoomsService } from "../roomsService.js";

const users = [
  ...MOCK_USERS,
  {
    id: "d31043a-1bc1-4df8-ae18-74d359f6166c",
    name: "Jane Doe",
    email: "jane@example.com",
  },
  {
    id: "25f4190b-fea5-4766-aef7-5fcd6d46a197",
    name: "John Doe",
    email: "john@example.com",
  },
];

describe("RoomService", () => {
  let service: RoomsService;
  let mockRoomsRepository: MockRoomsRepository;
  let mockUsersRepository: MockUsersRepository;

  beforeEach(() => {
    mockRoomsRepository = new MockRoomsRepository();
    mockUsersRepository = new MockUsersRepository();
    service = new RoomsService(mockRoomsRepository, mockUsersRepository);
  });

  describe("create", () => {
    it("creates room with an owner", async () => {
      const createRoomDto: CreateRoomDto = {
        owner: { id: MOCK_USERS[0].id },
        players: [MOCK_USERS[0].id],
        name: "My Room",
      };

      const result = await service.create(createRoomDto);

      expect(result).toEqual(
        expect.objectContaining({
          owner: expect.objectContaining({
            id: MOCK_USERS[0].id,
          }),
        })
      );
    });

    it("add the owner as a player to the room", async () => {
      const createRoomDto: CreateRoomDto = {
        owner: { id: MOCK_USERS[0].id },
        players: [MOCK_USERS[0].id],
        name: "My Room",
      };

      const result = await service.create(createRoomDto);

      expect(result?.players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: MOCK_USERS[0].id,
          }),
        ])
      );
    });
  });

  describe("addPlayer", () => {
    it("adds a player to the room", async () => {
      const playerId = MOCK_USERS[1].id;
      const roomId = MOCK_ROOMS[0].id;

      await service.addPlayer(playerId, roomId);

      const updatedRoom = await service.getById(roomId);

      expect(updatedRoom.players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: playerId,
          }),
        ])
      );
    });

    describe("when the given room is not found", () => {
      it("throws not found error", async () => {
        const playerId = MOCK_USERS[1].id;
        const roomId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";

        expect(service.addPlayer(playerId, roomId)).rejects.toThrow(
          new NotFoundError("Room not found")
        );
      });
    });

    describe("when the given player is not found", () => {
      it("throws not found error", async () => {
        const playerId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";
        const roomId = MOCK_ROOMS[0].id;

        expect(service.addPlayer(playerId, roomId)).rejects.toThrow(
          new NotFoundError("User not found")
        );
      });
    });

    describe("when the room is full", () => {
      it("throws validation error", async () => {
        const playerId = users[users.length - 1].id;
        const roomId = MOCK_ROOMS[0].id;

        MOCK_ROOMS[0].players = users.filter((u) => u.id !== playerId);
        mockUsersRepository = new MockUsersRepository(users);
        mockRoomsRepository = new MockRoomsRepository(MOCK_ROOMS);
        service = new RoomsService(mockRoomsRepository, mockUsersRepository);

        expect(service.addPlayer(playerId, roomId)).rejects.toThrow(
          new ValidationError(["Room is full"])
        );
      });
    });

    describe("when player is already in the room", () => {
      it("throws validation error", async () => {
        const playerId = MOCK_USERS[0].id;
        const roomId = MOCK_ROOMS[0].id;

        expect(service.addPlayer(playerId, roomId)).rejects.toThrow(
          new ValidationError(["Player is already in the room"])
        );
      });
    });
  });

  describe("getById", () => {
    it("returns the room", async () => {
      const roomId = MOCK_ROOMS[0].id;
      const result = await service.getById(roomId);

      expect(result).toEqual(MOCK_ROOMS[0]);
    });

    describe("when the given room is not found", () => {
      it("throws not found error", async () => {
        const roomId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";

        expect(service.getById(roomId)).rejects.toThrow(
          new NotFoundError("Room not found")
        );
      });
    });
  });

  describe("removePlayer", () => {
    it("removes a player from the room", async () => {
      const playerId = MOCK_USERS[1].id;
      const roomId = MOCK_ROOMS[0].id;

      MOCK_ROOMS[0].players = users;
      mockUsersRepository = new MockUsersRepository(users);
      mockRoomsRepository = new MockRoomsRepository(MOCK_ROOMS);
      service = new RoomsService(mockRoomsRepository, mockUsersRepository);

      await service.removePlayer(playerId, roomId);

      const updatedRoom = await service.getById(roomId);

      expect(updatedRoom.players).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            id: playerId,
          }),
        ])
      );
    });

    describe("when the given room is not found", () => {
      it("throws not found error", async () => {
        const playerId = MOCK_USERS[1].id;
        const roomId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";

        expect(service.removePlayer(playerId, roomId)).rejects.toThrow(
          new NotFoundError("Room not found")
        );
      });
    });

    describe("when the given player is not found", () => {
      it("throws not found error", async () => {
        const playerId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";
        const roomId = MOCK_ROOMS[0].id;

        expect(service.removePlayer(playerId, roomId)).rejects.toThrow(
          new NotFoundError("User not found")
        );
      });
    });

    describe("when the player is not in the room", () => {
      it("throws not found error", async () => {
        const playerId = MOCK_USERS[1].id;
        const roomId = MOCK_ROOMS[0].id;

        expect(service.removePlayer(playerId, roomId)).rejects.toThrow(
          new NotFoundError("User not found")
        );
      });
    });
  });

  describe("update", () => {
    it("updates the room correctly", async () => {
      const roomId = MOCK_ROOMS[0].id;
      const payload = {
        name: "New room name",
      };

      await service.update(roomId, payload);

      const updatedRoom = await service.getById(roomId);

      expect(updatedRoom.name).toBe(payload.name);
    });

    describe("when the given room is not found", () => {
      it("throws not found error", async () => {
        const roomId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";
        const payload = {
          name: "New room name",
        };

        expect(service.update(roomId, payload)).rejects.toThrow(
          new NotFoundError("Room not found")
        );
      });
    });
  });

  describe("delete", () => {
    it("deletes the room correctly", async () => {
      const roomId = MOCK_ROOMS[0].id;

      await service.delete(roomId);

      expect(service.delete(roomId)).rejects.toThrow(
        new NotFoundError("Room not found")
      );
    });

    describe("when the given room is not found", () => {
      it("throws not found error", async () => {
        const roomId = "25f4190b-fea5-4766-aef7-5fcd6d46a197";

        expect(service.delete(roomId)).rejects.toThrow(
          new NotFoundError("Room not found")
        );
      });
    });
  });
});
