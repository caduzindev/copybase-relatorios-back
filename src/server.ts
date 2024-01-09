import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import router from './presentation/routes/index'
import mongoose from 'mongoose';
import { databaseMongoInit } from './database';
import { initializeListeners } from './infraestructure/queues/bull';

const app = express()

app.use(express.json())
app.use(router)
app.use(cors())
app.use('/', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'Okay',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error: any) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

const port = process.env.PORT || 3005;

async function main() {
    console.log('MongoDB connect')
    await databaseMongoInit();

    console.log('Bull listeners initialize')
    initializeListeners()

    console.log('Up server')
    app.listen(port, () => console.log('Server is running'));
    
    console.log('All ready !!')
}

main()