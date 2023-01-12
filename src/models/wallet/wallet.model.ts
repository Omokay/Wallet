import { knexInstance } from "../connection";
import {Knex} from "knex";


async function createTable(): Promise<Knex.SchemaBuilder> {
    return knexInstance.schema.createTable('wallets', (table) => {
        table.increments('id').primary();
        table.string('account_no').notNullable();
        table.integer('balance').notNullable().defaultTo(0);
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
    });
}


export async function dropTable(table_name: string): Promise<Knex.SchemaBuilder> {
    return knexInstance.schema.dropTable(table_name);
}

export const WalletModel = {
    createTable,
}
