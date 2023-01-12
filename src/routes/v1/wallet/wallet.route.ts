import express from 'express';
import {JWT} from "../../../authentication/jwt.authentication";
import {TransactionController} from "../transaction/transaction.controller";



const wallet_router = express.Router();

// Create Account
wallet_router.post('/', JWT.authenticateToken, TransactionController.createAccount);


// Withdraw from Account
wallet_router.post('/withdraw', JWT.authenticateToken, TransactionController.withdrawFromAccount);


// Fund Account
wallet_router.post('/fund', JWT.authenticateToken, TransactionController.fundAccount);


// Transfer to another Acccount
wallet_router.post('/transfer', JWT.authenticateToken, TransactionController.transferToOther);



export {
    wallet_router,
}
