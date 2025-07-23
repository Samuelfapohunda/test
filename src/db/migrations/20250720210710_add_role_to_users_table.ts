// create_blacklist_table.ts

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("blacklist", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().nullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("reason").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("blacklist");
}
