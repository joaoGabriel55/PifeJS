import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rounds", (table) => {
    table.uuid("id").primary();

    table.jsonb("deck").notNullable();
    table.jsonb("hands").notNullable();

    table.uuid("matchId").notNullable().references("id").inTable("matches");
    table.uuid("currentPlayerId").notNullable().references("id").inTable("users");

    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("rounds");
}
