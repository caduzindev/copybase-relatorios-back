import express from 'express'
import cors from 'cors'
import router from './presentation/routes/index'
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

const porta = process.env.PORT || 3005;
app.listen(porta, () => console.log('Server is running'));