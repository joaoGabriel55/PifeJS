import request from "supertest";
import { makeDatabase } from "../../infra/database/database.js";
import { makeServer } from "../server.js";
import { UserModel } from "../../infra/database/models/userModel.js";
import { RoomModel } from "../../infra/database/models/roomModel.js";
import { RoomsRepository } from "../../repositories/roomsRepository.js";
import UsersRepository from "../../repositories/usersRepository.js";

const express = makeServer();
const database = makeDatabase();

const users = [
  {
    id: "b9f3147e-f42e-4d5d-9b7f-9f1e62bb22a2",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b4",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    id: "978b65ce-aa59-4881-81fa-745834855f60",
    name: "John Smith",
    email: "john.smith@example.com",
  },
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b6",
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b7",
    name: "John Johnson",
    email: "john.johnson@example.com",
  },
];

const rooms = [
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b3",
    name: "My room",
    owner: users[0],
    players: [users[0]],
    createdAt: new Date(),
  },
];

beforeAll(async () => {
  await database.connect();
});

afterAll(async () => {
  await database.disconnect();
});

describe("Rooms Controller", () => {
  let usersRepository: UsersRepository;
  let roomsRepository: RoomsRepository;

  beforeEach(async () => {
    usersRepository = new UsersRepository();
    roomsRepository = new RoomsRepository();

    await Promise.all(
      users.map((user) => {
        return usersRepository.create(user);
      })
    );

    await Promise.all(
      rooms.map((room) => {
        return roomsRepository.create(room);
      })
    );
  });

  afterEach(async () => {
    await UserModel.query().delete();
    await RoomModel.query().delete();
  });

  describe("GET /rooms", () => {
    it("returns all rooms", async () => {
      const response = await request(express).get("/rooms");

      const expectedRooms = rooms.map((room) => {
        return {
          id: expect.any(String),
          name: room.name,
          owner: expect.objectContaining({ id: room.owner.id }),
          players: expect.arrayContaining(room.players),
          createdAt: expect.any(String),
          updatedAt: null,
        };
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(expectedRooms);
    });
  });

  describe("GET /rooms/:id", () => {
    it("returns the given room", async () => {
      const response = await request(express).get(`/rooms/${rooms[0].id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: rooms[0].id,
        name: rooms[0].name,
        owner: expect.objectContaining({ id: rooms[0].owner.id }),
      });
    });

    describe("when the room is not found", () => {
      it("returns HTTP 404", async () => {
        const response = await request(express).get(
          "/rooms/f92bc22d-f2cc-4619-ab22-f032378a36b5"
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "Room not found" });
      });
    });
  });

  describe("POST /rooms", () => {
    it("creates a room with an owner", async () => {
      const payload = {
        name: "My room",
        owner: { id: users[0].id },
        players: [],
      };

      const response = await request(express).post("/rooms").send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        ...payload,
        owner: users[0],
        players: expect.arrayContaining([users[0]]),
        createdAt: expect.any(String),
      });
    });

    describe("when the owner is not found", () => {
      it("returns HTTP 404", async () => {
        const payload = {
          name: "My room",
          owner: { id: "f92bc22d-f2cc-4619-ab22-f032378a36b5" },
          players: [],
        };

        const response = await request(express).post("/rooms").send(payload);

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });

    describe("when the payload is invalid", () => {
      it("returns HTTP 422", async () => {
        const payload = { name: 123 };
        const response = await request(express).post("/rooms").send(payload);

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining(["Name must be a string"]),
        });
      });
    });

    describe("when a given player is not found", () => {
      it("creates a room with the existing players", async () => {
        const payload = {
          name: "My room",
          owner: { id: users[0].id },
          players: ["f92bc22d-f2cc-4619-ab22-f032378a36b5", users[1].id],
        };

        const response = await request(express).post("/rooms").send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          players: expect.arrayContaining([users[0], users[1]]),
        });
      });
    });
  });

  describe("PATCH /rooms/:id/players/:playerId/add", () => {
    it("adds a player to the room", async () => {
      const roomId = rooms[0].id;
      const playerId = users[1].id;

      const response = await request(express)
        .patch(`/rooms/${roomId}/players/${playerId}/add`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        players: expect.arrayContaining([users[0], users[1]]),
      });
    });

    describe("when the room is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";
        const playerId = users[1].id;

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/add`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "Room not found" });
      });
    });

    describe("when the player is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = rooms[0].id;
        const playerId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/add`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });

    describe("when the room is full", () => {
      beforeEach(async () => {
        const updatedRoom = { ...rooms[0], players: [...rooms[0].players] };

        for (let i = 1; i < users.length; i++) {
          updatedRoom.players.push(users[i]);
        }
        await roomsRepository.update(rooms[0].id, updatedRoom);
      });

      it("returns HTTP 422", async () => {
        const roomId = rooms[0].id;
        const playerId = users[users.length - 1].id;

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/add`)
          .send();

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Verification error",
          errors: expect.arrayContaining(["Room is full"]),
        });
      });
    });

    describe("when the player is already in the room", () => {
      it("returns HTTP 422", async () => {
        const roomId = rooms[0].id;
        const playerId = users[0].id;

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/add`)
          .send();

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Verification error",
          errors: expect.arrayContaining(["User is already in the room"]),
        });
      });
    });
  });

  describe("PATCH /rooms/:id/players/:playerId/remove", () => {
    it("removes a player from the room", async () => {
      const roomId = rooms[0].id;
      const playerId = users[0].id;

      const response = await request(express)
        .patch(`/rooms/${roomId}/players/${playerId}/remove`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        players: expect.not.arrayContaining([users[0]]),
      });
    });

    describe("when the room is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";
        const playerId = users[0].id;

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/remove`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "Room not found" });
      });
    });

    describe("when the player is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = rooms[0].id;
        const playerId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/remove`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });

    describe("when there is only one player in the room", () => {
      it("returns HTTP 200", async () => {
        const roomId = rooms[0].id;
        const playerId = users[2].id;

        const response = await request(express)
          .patch(`/rooms/${roomId}/players/${playerId}/remove`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
          message: "User not found",
        });
      });
    });
  });

  describe("PATCH /rooms/:id", () => {
    it("updates a room", async () => {
      const roomId = rooms[0].id;
      const payload = { name: "New name" };

      const response = await request(express)
        .patch(`/rooms/${roomId}`)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ name: "New name" });
    });

    describe("when the room is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";
        const payload = { name: "New name" };

        const response = await request(express)
          .patch(`/rooms/${roomId}`)
          .send(payload);

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "Room not found" });
      });
    });

    describe("when trying to update players", () => {
      it("it responds with HTTP 422", async () => {
        const roomId = rooms[0].id;
        const payload = {
          players: [users[0].id, users[1].id],
        };

        const response = await request(express)
          .patch(`/rooms/${roomId}`)
          .send(payload);

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining([
            "Unrecognized key(s) in object: 'players'",
          ]),
        });
      });
    });

    describe("when the payload is invalid", () => {
      it("returns HTTP 422", async () => {
        const roomId = rooms[0].id;
        const payload = { owner: { id: users[1].id } };

        const response = await request(express)
          .patch(`/rooms/${roomId}`)
          .send(payload);

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining([
            "Unrecognized key(s) in object: 'owner'",
          ]),
        });
      });
    });
  });

  describe("DELETE /rooms/:id", () => {
    it("deletes a room", async () => {
      const roomId = rooms[0].id;

      const response = await request(express).delete(`/rooms/${roomId}`).send();

      expect(response.status).toBe(200);
    });

    describe("when the room is not found", () => {
      it("returns HTTP 404", async () => {
        const roomId = "f92bc22d-f2cc-4619-ab22-f032378a36b5";

        const response = await request(express)
          .delete(`/rooms/${roomId}`)
          .send();

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "Room not found" });
      });
    });
  });
});
