// create_transactions_table.ts

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("wallet_id").unsigned().notNullable().references("id").inTable("wallets").onDelete("CASCADE");
    table.enum("type", ["credit", "debit"]).notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.string("reference").notNullable().unique();
    table.text("description").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
