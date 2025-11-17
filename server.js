import cors from 'cors';
import express from 'express';
const app = express();
import { connectDB } from './config.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import routes from './routes/index.js';
const start = async () => {
    await connectDB();
    app.use('/', routes);
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

start();