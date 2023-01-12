import { knexInstance } from "./connection"
import {Utils} from "../utils/utils";
import {Bcrypt} from "../authentication/bcrypt.authentication";

async function seedDB(): Promise<void> {
    const hashed_password = await Bcrypt.hashPassword('password');
    // Seed to Users Table
    await knexInstance('users')
        .insert({
            id: 1,
            username: 'mokay',
            name: 'Omoke Chuku',
            email: 'chuku.omoke@gmail.com',
            password: hashed_password,
            created: new Date(),
        });


    const account = await Utils.generateAccountNumber(1);
    // Seed to Wallet accounts Table
    await knexInstance('wallets')
        .insert({
            id: 1,
            account_no: account,
            balance: 100000,
            user_id: 1,
        })

    const ref = await Utils.generateReference();
    // Seed to Transactions Table
    await knexInstance('transactions')
        .insert({
            id: 1,
            amount: 100000,
            account_no: account,
            type: 'DEPOSIT',
            direction: 'IN',
            reference_id: ref,
            description: 'Initial Deposit',
            initiated: new Date(),
            balance_after: 100000,
        });


}


export {
    seedDB,
}
