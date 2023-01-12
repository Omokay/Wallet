import dotenv from "dotenv";
dotenv.config();


const db_config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT_DOCKER,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    database_test: process.env.MYSQL_DB_TEST_NAME,
};

const client = 'mysql2';
const jwt_secret = process.env.JWT_SECRET;

export {
    db_config,
    client,
    jwt_secret,
}
