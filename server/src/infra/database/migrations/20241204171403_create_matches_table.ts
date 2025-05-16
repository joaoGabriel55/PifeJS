import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("matches", (table) => {
    table.uuid("id").primary();
    table.string("state").notNullable();

    table.uuid("roomId").notNullable().references("id").inTable("rooms");
    table.uuid("winnerId").nullable().references("id").inTable("users");

    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("matches");
}
