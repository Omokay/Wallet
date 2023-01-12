import {client, db_config} from "./src/config/config";


export const KnexConfig =  {
    development: {
        client: client,
        connection: {
            host: db_config.host || '127.0.0.1',
            port: db_config.port || '3307',
            database: db_config.database || 'lendsqr',
            user: db_config.user || 'root',
            password: db_config.password || 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
    },
    test: {
        client: client,
        connection: {
            host: db_config.host || '127.0.0.1',
            port: db_config.port || '3307',
            database: db_config.database_test || 'test_lendsqr',
            user: db_config.user || 'root',
            password: db_config.password || 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
    },

};

