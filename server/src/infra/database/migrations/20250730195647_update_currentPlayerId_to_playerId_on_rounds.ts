import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("rounds", (table) => {
    table.renameColumn("currentPlayerId", "playerId");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("rounds", (table) => {
    table.renameColumn("playerId", "currentPlayerId");
  });
}

