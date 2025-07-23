import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary(); // auto-incrementing primary key
    table.string("email").notNullable().unique(); // unique user email
    table.string("name").notNullable(); // user name
    table.string("password").notNullable(); // hashed password
    table.timestamps(true, true); // created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
