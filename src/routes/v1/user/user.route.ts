import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import {Validation} from "../../../middleware/validation.middleware";


const user_router = express.Router();


user_router.post('/login', Validation.login, UserController.login);

user_router.post('/register', UserController.signup);


export {
    user_router,
}
