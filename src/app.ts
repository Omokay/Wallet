import express from 'express';
import cors from 'cors';
import { api_v1 } from './routes/v1/v1';

const app = express();

app.use(cors({
    origin: '*',
}));

app.use(express.json());
app.use('/api/v1', api_v1);


export {
    app
};
