import {check, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";





async function login(req: Request, res: Response, next: NextFunction): Promise<void | object> {

    await check('username')
                .isString()
                .isLength({ min: 2 }).withMessage('must be at least 2 chars long')
                .notEmpty().withMessage('cannot be empty'),
            check('password')
                .notEmpty().withMessage('must not be empty')
                .isString().withMessage('must be a string');

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}


function createWallet(req: Request, res: Response, next: NextFunction): any {
    const errors = validationResult(req);
    check('initial_deposit')
                .isNumeric().withMessage('must be number')
                .notEmpty().withMessage('must not be empty');

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}


function transferEntries(req: Request, res: Response, next: NextFunction): any {
    const errors = validationResult(req);
    check('amount')
                .isNumeric().withMessage('amount must be number')
                .notEmpty().withMessage('amount must not be empty'),
            check('beneficiary_account')
                .isString().withMessage('must be a string')
                .isLength({min: 10, max: 10}),
            check('narration')
                .isString().withMessage('must be a string')
                .notEmpty().withMessage('must not be empty');

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}

function checker(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    check('amount')
        .isNumeric().withMessage('must be a number')
        .notEmpty().withMessage('must not be empty');

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}


export const Validation = {
    login,
    createWallet,
    checker,
    transferEntries,
}
