import request from "supertest";
import { makeServer } from "../server.js";
import { makeDatabase } from "../../infra/database/database.js";
import { UserModel } from "../../infra/database/models/userModel.js";

const express = makeServer();
const database = makeDatabase();

const users = [
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b3",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: "f92bc22d-f2cc-4619-ab22-f032378a36b4",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
];

beforeAll(async () => {
  await database.connect();
});

beforeEach(async () => {
  await UserModel.query().insertGraph(users);
});

afterEach(async () => {
  await UserModel.query().delete();
});

afterAll(async () => {
  await database.disconnect();
});

describe("Users Controller", () => {
  describe("GET /users", () => {
    it("returns HTTP 200", async () => {
      const response = await request(express).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(users);
    });
  });

  describe("GET /users/:id", () => {
    describe("when the user is found", () => {
      it("returns HTTP 200", async () => {
        const response = await request(express).get(
          "/users/f92bc22d-f2cc-4619-ab22-f032378a36b3"
        );

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(users[0]);
      });
    });

    describe("when the user is not found", () => {
      it("returns HTTP 404", async () => {
        const response = await request(express).get(
          "/users/f92bc22d-f2cc-4619-ab22-f032378a36b5"
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });
  });

  describe("POST /users", () => {
    it("creates a user", async () => {
      const payload = { name: "John", email: "john@example.com" };

      const response = await request(express)
        .post("/users")
        .send(payload)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
        ...payload,
      });
    });

    describe("when email is missing", () => {
      it("does not create a user", async () => {
        const payload = { name: "John" };

        const response = await request(express)
          .post("/users")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining(["Email is missing"]),
        });
      });
    });

    describe("when email is invalid", () => {
      it("does not create a user", async () => {
        const payload = { name: "John", email: "john" };

        const response = await request(express)
          .post("/users")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining(["Email is invalid"]),
        });
      });
    });
  });

  describe("PUT /users/:id", () => {
    describe("when the user is found", () => {
      it("updates a user", async () => {
        const payload = { name: "John Banana" };
        const response = await request(express)
          .put("/users/f92bc22d-f2cc-4619-ab22-f032378a36b3")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(
          expect.objectContaining({
            ...payload,
          })
        );
      });
    });

    describe("when the user is not found", () => {
      it("returns HTTP 404", async () => {
        const payload = { name: "John Banana" };
        const response = await request(express)
          .put("/users/f92bc22d-f2cc-4619-ab22-f032378a36b5")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });

    describe("when the payload is invalid", () => {
      it("returns HTTP 422", async () => {
        const payload = { name: 123 };
        const response = await request(express)
          .put("/users/f92bc22d-f2cc-4619-ab22-f032378a36b3")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining(["Name must be a string"]),
        });
      });
    });

    describe("when an invalid field name is provided", () => {
      it("returns HTTP 422", async () => {
        const payload = { name: "John Banana", invalidField: "invalid" };
        const response = await request(express)
          .put("/users/f92bc22d-f2cc-4619-ab22-f032378a36b3")
          .send(payload)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({
          message: "Validation error",
          errors: expect.arrayContaining([
            "Unrecognized key(s) in object: 'invalidField'",
          ]),
        });
      });
    });
  });

  describe("DELETE /users/:id", () => {
    describe("when the user is found", () => {
      it("deletes a user", async () => {
        const userId = "f92bc22d-f2cc-4619-ab22-f032378a36b3";
        const response = await request(express).delete(`/users/${userId}`);

        expect(response.status).toBe(204);
        expect(response.body).toStrictEqual({});
        expect(UserModel.query().findById(userId)).resolves.toBeUndefined();
      });
    });

    describe("when the user is not found", () => {
      it("returns HTTP 404", async () => {
        const response = await request(express).delete(
          "/users/f92bc22d-f2cc-4619-ab22-f032378a36b5"
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ message: "User not found" });
      });
    });
  });
});
