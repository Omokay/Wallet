import { knexInstance } from "../connection";
import {Knex} from "knex";


async function createTable(): Promise<Knex.SchemaBuilder> {
    return knexInstance.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.timestamp('created').notNullable();
    });
}

export const UserModel = {
    createTable,
}
