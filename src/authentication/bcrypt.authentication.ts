import bcrypt from "bcrypt";


async function hashPassword(text: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashed_password = await bcrypt.hashSync(text, salt);

    return hashed_password;

}


async function validatePassword(text: string, hashed: string): Promise<boolean> {
    const is_validated = bcrypt.compareSync(text, hashed);
    if (is_validated) {
        return true;
    }
    return false;
}



export const Bcrypt = {
    hashPassword,
    validatePassword,
}
