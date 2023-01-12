import luhn from 'luhn-generator';
import { v4 as transactionRef } from 'uuid';


async function generateAccountNumber(id: number): Promise<string> {
    return luhn.generate(id, { pad: 10 });
}

async function isLuhn(account_no: string): Promise<boolean> {
    return luhn.isValid(account_no);
}


async function generateReference(): Promise<string> {
    return transactionRef();
}



export const Utils = {
    generateAccountNumber,
    generateReference,
}
