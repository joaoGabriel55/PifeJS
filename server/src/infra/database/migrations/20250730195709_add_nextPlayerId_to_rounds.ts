import type { Knex } from "knex";
import { nullable } from "zod";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("rounds", (table) => {
    table.uuid("nextPlayerId").nullable().references("id").inTable("users");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("rounds", (table) => {
    table.dropColumn("nextPlayerId");
  });
}

