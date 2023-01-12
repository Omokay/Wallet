import {knexInstance} from "../connection";

async function getUserByEmail(email: string): Promise<object> {
    return knexInstance('users').select().where('email', '=', `${email}`).first();
}

async function getUserById(id: number): Promise<object> {
    return knexInstance('users').select().where('id', '=', `${id}`).first();
}


async function getUserByUsername(username): Promise<object> {
    return knexInstance('users').select().where('username', '=', `${username}`).first();
}

async function saveUser(user: object): Promise<object> {
    return knexInstance('users')
        .insert(user).then( ([id]) => knexInstance('users')
            .select()
            .where('id', id)
            .first());
}



export const QueryUsers = {
    getUserByEmail,
    getUserByUsername,
    saveUser,
    getUserById,

}
