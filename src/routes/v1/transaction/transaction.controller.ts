import {Request, Response} from 'express';
import {QueryWallets} from "../../../models/wallet/wallet.query";
import {Utils} from "../../../utils/utils";
import {QueryUsers} from "../../../models/user/user.query";
import {QueryTransactions} from "../../../models/transaction/transaction.query";


async function createAccount(req: Request, res: Response): Promise<object>{
    const { initial_deposit } = req.body;
    const {id} = req['user']

    const existing_wallet = await QueryWallets.getWalletByUserId(id);
    if (existing_wallet) {
        return res.status(409).json({
            success: false,
            message: 'User already has an account',
        })
    }

    try {
        const account_no = await Utils.generateAccountNumber(id);
        await QueryTransactions.createAccount(account_no, initial_deposit, id);
        return res.status(201).json({
            success: true,
            message: 'Account has been created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while attempting to create an account',
        });
    }
}

async function withdrawFromAccount(req: Request, res: Response): Promise<object> {
    const { amount } = req.body;
    const {id} = req['user'];


    const wallet = await QueryWallets.getWalletByUserId(id);
    if (!wallet) {
        return res.status(404).json({
            success: false,
            message: 'User does not have an account',
        })
    }
    const account = wallet['account_no']
    const current_balance = wallet['balance'];
    const walletId = wallet['id'];

    if (current_balance < amount) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient balance',
        })
    }
    try {
        // start a transaction
        await QueryTransactions.withdrawFromBalance(walletId, amount, account, current_balance);
        res.status(200).json({
            success: true,
            message: 'Withdrawal was successful',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while attempting to withdraw from wallet',
        });
    }
}

async function fundAccount(req: Request, res: Response): Promise<object> {
    const {id} = req['user'];
    const { amount } = req.body;


    const wallet = await QueryWallets.getWalletByUserId(id);
    if (!wallet) {
        return res.status(404).json({
            success: false,
            message: 'User does not have an account',
        })
    }
    const account = wallet['account_no']
    const current_balance = wallet['balance'];
    const walletId = wallet['id'];

    try {
        // start a transaction
        await QueryTransactions.fundWallet(walletId, amount, account, current_balance);
        return res.json({
            success: true,
            message: 'Wallet was funded successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while attempting to fund wallet',
        });
    }
}

async function transferToOther(req: Request, res: Response): Promise<object> {
    const {amount, beneficiary_account, narration} = req.body;
    const {id, username} = req['user'];


    const wallet_from = await QueryWallets.getWalletByUserId(id);
    // Case: No sender account
    if (!wallet_from) {
        return res.status(404).json({
            success: false,
            message: 'Sender must have an account',
        })
    }
    const id_from = wallet_from['id'];
    const account_from = wallet_from['account_no'];
    const balance_from = wallet_from['balance'];

    const wallet_to = await QueryWallets.getWalletByAccount(beneficiary_account);
    // Case: no beneficiary account
    if (!wallet_to) {
        return res.status(404).json({
            success: false,
            message: 'Beneficiary account not found'
        })
    }

    // Case: insufficient balance
    if (balance_from < amount) {
        return res.status(400).json({
            success: false,
            message: 'Insufficient balance',
        })
    }
    const id_to = wallet_to['id']
    const balance_to = wallet_to['balance'];
    const user_to = await QueryUsers.getUserById(wallet_to['user_id']);
    const beneficiary_name = user_to['name'];

    // start transactions
    try {
        await QueryTransactions.transferTo(amount, narration, id_from, account_from, balance_from, id_to, beneficiary_account, balance_to);
        return res.status(200).json({
            success: true,
            message: `Transfer was successful`,
            details: {
                from: username,
                to: beneficiary_name,
                amount,
                narration,
            }
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while attempting to transfer funds'
        })
    }

}

export const TransactionController = {
    createAccount,
    withdrawFromAccount,
    fundAccount,
    transferToOther
}
