import {knexInstance} from "../connection";
import {Utils} from "../../utils/utils";

async function createAccount(account_no: string, initial_deposit: number, user_id: number): Promise<void> {
    const reference = await Utils.generateReference();
    return await knexInstance.transaction((trx): Promise<any> => {
        return trx.insert({
            account_no,
            balance: initial_deposit,
            user_id,
        }).into('wallets')
            .then(function (ids) {
                // insert into the transactions table
                return trx.insert({
                    amount: initial_deposit,
                    account_no: account_no,
                    type: 'DEPOSIT',
                    direction: 'IN',
                    reference_id: reference,
                    description: 'Initial Deposit',
                    initiated: new Date(),
                    balance_after: initial_deposit,
                }).into('transactions');
            })
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

async function withdrawFromBalance(walletId: number, amount: number, account: string, current_balance: number): Promise<void> {
    const reference = await Utils.generateReference();
    return await knexInstance.transaction(async (trx) => {
        // update the wallet balance
        await trx('wallets')
            .where('id', walletId)
            .decrement('balance', amount)
            .then((data)=>{
                return trx('transactions').insert({
                    amount: amount,
                    account_no: account,
                    type: 'WITHDRAWAL',
                    direction: 'OUT',
                    reference_id: reference,
                    description: 'Withdrawal',
                    initiated: new Date(),
                    balance_after: current_balance - amount,
                });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    });
}

async function fundWallet(walletId: number, amount: number, account: string, current_balance: number): Promise<void> {
    const reference = await Utils.generateReference();
    return knexInstance.transaction(async(trx) => {
        // update the wallet balance
        await trx('wallets')
            .where('id', walletId)
            .increment('balance', amount)
            .then((data)=>{
                return trx('transactions').insert({
                    amount: amount,
                    account_no: account,
                    type: 'DEPOSIT',
                    direction: 'IN',
                    reference_id: reference,
                    description: 'Wallet Funding',
                    initiated: new Date(),
                    balance_after: current_balance + amount,
                });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
}

async function transferTo(amount: number, description: string, wallet_from: number, account_from: string, balance_from: number, wallet_to: number, account_to: string, balance_to: number): Promise<void> {
    const reference = await Utils.generateReference();
    return knexInstance.transaction(async(trx) => {
        // update the wallet balance
        await trx('wallets')
            .where('id', wallet_from)
            .decrement('balance', amount)
            .then((data) => {
                return trx('transactions').insert({
                    amount: amount,
                    account_no: account_from,
                    type: 'TRANSFER',
                    direction: 'OUT',
                    reference_id: reference,
                    description,
                    initiated: new Date(),
                    balance_after: balance_from - amount,
                }).then(async () => {
                    await trx('wallets')
                        .where('id', wallet_to)
                        .increment('balance', amount)
                        .then((data) => {
                            return trx('transactions').insert({
                                amount: amount,
                                account_no: account_to,
                                type: 'DEPOSIT',
                                direction: 'IN',
                                reference_id: reference,
                                description,
                                initiated: new Date(),
                                balance_after: balance_to + amount,
                            })
                        })
                        .then(trx.commit)
                        .catch(trx.rollback)
                })
            })
    })
}


export const QueryTransactions = {
    createAccount,
    withdrawFromBalance,
    fundWallet,
    transferTo,
}
