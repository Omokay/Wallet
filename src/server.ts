import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { app } from './app';
import { setupDb } from './models/setup';

export const server = http.createServer(app);
const PORT = 2023;

async function startServer() {
    await setupDb();
    server.listen(PORT, () => {
        console.log(`[Demo Credit]: is running on port ${PORT}`)
    })
}

startServer();






