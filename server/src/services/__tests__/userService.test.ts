import { NotFoundError } from "../../errors/notFoundError.js";
import {
  MOCK_USERS,
  MockUsersRepository,
} from "../../repositories/__mocks__/mockUsersRepository.js";
import { UserService } from "../usersService.js";

describe("UserService", () => {
  let mockUsersRepository: MockUsersRepository;
  let service: UserService;

  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    service = new UserService(mockUsersRepository);
  });

  describe("findAll", () => {
    describe("when there are no users", () => {
      it("it returns an empty array", async () => {
        mockUsersRepository = new MockUsersRepository([]);
        service = new UserService(mockUsersRepository);

        const result = await service.getAll();

        expect(result).toEqual([]);
      });
    });

    describe("when there are users", () => {
      it("returns the users", async () => {
        const result = await service.getAll();

        expect(result).toStrictEqual(MOCK_USERS);
      });
    });
  });

  describe("getById", () => {
    describe("when the user is not found", () => {
      it("returns null", async () => {
        const userId = "d31043a-1bc1-4df8-ae18-74d359f6166c";
        expect(service.getById(userId)).rejects.toThrow(
          new NotFoundError("User not found")
        );
      });
    });

    describe("when the user exists", () => {
      it("returns the user", async () => {
        const result = await service.getById(
          "779a9f79-87f6-40a6-a402-b247cb4d1eff"
        );

        expect(result).toStrictEqual({
          id: "779a9f79-87f6-40a6-a402-b247cb4d1eff",
          name: "John Doe",
          email: "john@example.com",
        });
      });
    });
  });

  describe("create", () => {
    it("creates a user", async () => {
      const payload = { name: "Julius", email: "julius@example.com" };

      const result = await service.create(payload);

      expect(result).toStrictEqual({
        ...payload,
        id: expect.any(String),
      });
    });
  });

  describe("update", () => {
    it("updates the user correctly", async () => {
      const payload = {
        name: "Jane Jane",
      };

      const updatedUser = await service.update(
        "b9f3147e-f42e-4d5d-9b7f-9f1e62bb22a2",
        payload
      );

      expect(updatedUser).toStrictEqual({
        id: "b9f3147e-f42e-4d5d-9b7f-9f1e62bb22a2",
        name: "Jane Jane",
        email: "jane@example.com",
      });
    });

    describe("when the user does not exist", () => {
      it("throws not found error", async () => {
        const payload = {
          name: "Jonas",
        };

        expect(
          service.update("d31043a-1bc1-4df8-ae18-74d359f6166c", payload)
        ).rejects.toThrow(new NotFoundError("User not found"));
      });
    });
  });

  describe("delete", () => {
    it("deletes the user correctly", async () => {
      const [user] = await service.getAll();

      expect(user).not.toBeNull();

      await service.delete(user.id);

      expect(service.getById(user.id)).rejects.toThrow(
        new NotFoundError("User not found")
      );
    });

    describe("when the user does not exist", () => {
      it("throws not found error", async () => {
        expect(
          service.delete("d31043a-1bc1-4df8-ae18-74d359f6166c")
        ).rejects.toThrow(new NotFoundError("User not found"));
      });
    });
  });
});
