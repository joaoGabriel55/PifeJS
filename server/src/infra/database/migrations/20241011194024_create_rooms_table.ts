import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rooms", (table) => {
    table.uuid("id").primary();
    table.string("name").nullable();

    table.uuid("ownerId").references("id").inTable("users").onDelete("CASCADE");

    table.dateTime("createdAt").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updatedAt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("rooms");
}
