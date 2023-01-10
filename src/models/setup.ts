import { knexInstance } from "./connection";

import {TransactionModel} from './transaction/transaction.model';
import {WalletModel} from './wallet/wallet.model';
import {seedDB} from './seed';
import {UserModel} from "./user/user.model";

async function setupDb() {
    const userExists = await knexInstance.schema.hasTable('users');
    const walletExists = await knexInstance.schema.hasTable('wallets');
    const transactionExists = await knexInstance.schema.hasTable('transactions');

    knexInstance.raw("drop table if exists transactions cascade;").then(() => console.log('Dropping Transactions Table...'));
    knexInstance.raw("drop table if exists wallets cascade;").then(() => console.log('Dropping Wallets Table...'));
    knexInstance.raw("drop table if exists users cascade;").then(() => console.log('Dropping Users Table...'))

    await UserModel.createTable().catch(err => console.error(err));
    await WalletModel.createTable().catch(err => console.error(err));
    await TransactionModel.createTable().catch(err => console.error(err));

    if(!(walletExists || transactionExists || userExists)){
        await seedDB();
    }
}



export {setupDb};
