import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("room_players", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table
        .uuid("roomId")
        .notNullable()
        .references("id")
        .inTable("rooms")
        .onDelete("CASCADE");
      table
        .uuid("playerId")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table.dateTime("createdAt").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updatedAt").nullable();

      table.unique(["roomId", "playerId"]);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("room_players");
}
