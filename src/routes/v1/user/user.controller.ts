import {Request, Response, NextFunction} from 'express';
import {JWT} from "../../../authentication/jwt.authentication";
import {QueryUsers} from "../../../models/user/user.query";
import {Bcrypt} from "../../../authentication/bcrypt.authentication";


async function login(req: Request, res: Response, next: NextFunction): Promise<object> {
    const {username, password} = req.body;

    const user = await QueryUsers.getUserByUsername(username);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials',
        })
    }
    const stored_password = user['password'];

    const is_password_valid = await Bcrypt.validatePassword(password, stored_password);
    const token = await JWT.getJwtToken({id: user['id'], username});


   if (!is_password_valid) {
       return res.status(400).json({
           success: false,
           message: 'Invalid credentials',
       })
   }
   return res.status(200).json({
        success: true,
        username,
        token,
   });

}


async function signup(req: Request, res: Response, next: NextFunction): Promise<object> {
    const {username, name, email, password} = req.body;
    const created = new Date();

    const is_email_existing = await QueryUsers.getUserByEmail(email);
    if (is_email_existing) {
        return res.status(409).json({
            success: false,
            message: 'Email already exists',
        });
    }

    const is_username_existing = await QueryUsers.getUserByUsername(username);
    if (is_username_existing) {
        return res.status(409).json({
            success: false,
            message: 'Username already exists'
        })
    }

    // const token = await JWT.getJwtToken({username, email});
    const hashed_password = await Bcrypt.hashPassword(password);

    const signup_payload = {
        username,
        name,
        email,
        password: hashed_password,
        created,
    }

    try {
        await QueryUsers.saveUser(signup_payload);
        return res.status(200).json({
            success: true,
            message: 'User has been added',
            user: {
                username,
                email,
                // token,
                created,
            }
        });
    } catch(err) {
        console.error(err);
    }

}

export const UserController = {
    login,
    signup
}
