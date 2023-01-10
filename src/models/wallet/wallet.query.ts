import {knexInstance} from "../connection";

async function getWalletByUserId(user_id: number): Promise<object> {
    const wallet: object = await  knexInstance('wallets').select().where('user_id', '=', `${user_id}`).first();
    return wallet;
}

async function getWalletByAccount(account: string): Promise<object> {
    const wallet = await knexInstance('wallets').select().where('account_no', '=', `${account}`).first();
    return wallet;
}


async function getBalance(walletId: number): Promise<number> {
    const wallet: object = await knexInstance('wallets').select('balance').where('id', '=', `${walletId}`).first();
    return wallet['balance'];
}

async function getAccount(walletId: number): Promise<number> {
    const wallet: object = await knexInstance('wallets').where('id', '=', `${walletId}`).first();
    return wallet['account_no'];
}




export const QueryWallets = {
    getWalletByUserId,
    getWalletByAccount
}
