import jsonwebtoken from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {jwt_secret} from "../config/config";


async function getJwtToken (data: object): Promise<string> {
    return jsonwebtoken.sign(data, jwt_secret, { expiresIn: '1800s' });

}


async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void | object> {
    try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ');
    if (token[1] == null) {
        return res.status(401).json({
            success: false,
            message: 'Authorization is required',
        })
    }
    const user = await jsonwebtoken.verify(token[1], jwt_secret);
    if (!user) {
        if (token[1] == null) {
            return res.status(401).json({
                success: false,
                message: 'User is not authorized',
            })
        }
    }
    req['user'] = user;
    next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while attempting to generate user token',
            type: err.name,
        })
    }
}


export const JWT = {
    getJwtToken,
    authenticateToken,
}
