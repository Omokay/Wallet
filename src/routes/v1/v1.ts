import express from 'express';
import { wallet_router } from './wallet/wallet.route';
import {user_router} from "./user/user.route";


const api_v1 = express.Router();

api_v1.use('/users', user_router);
api_v1.use('/wallets', wallet_router);



export { api_v1 };
