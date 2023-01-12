import { knexInstance } from "../connection";
import {Knex} from "knex";


async function createTable(): Promise<Knex.SchemaBuilder> {
    return knexInstance.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('amount').notNullable();
        table.string('reference_id').notNullable();
        table.string('account_no').notNullable();
        table.enum('type', ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']).notNullable();
        table.enum('direction', ['IN', 'OUT']).notNullable();
        table.string('description').nullable();
        table.timestamp('initiated').notNullable();
        table.integer('balance_after').notNullable();
    });
}

export const TransactionModel = {
    createTable,
}
