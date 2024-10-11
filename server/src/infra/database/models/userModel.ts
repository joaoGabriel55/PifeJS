import { Model, ModelObject } from "objection";

class UserModel extends Model {
  static tableName = "users";

  id!: string;
  email!: string;
  name?: string;

  static jsonSchema = {
    type: "object",
    required: ["email", "id"],
    properties: {
      id: { type: "string", format: "uuid" },
      email: { type: "string", format: "email" },
      name: { type: "string" },
    },
  };
}

export { UserModel };
