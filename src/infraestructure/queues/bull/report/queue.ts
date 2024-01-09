import Queue from 'bull'
import { RedisConfig } from '../redis.config'

export const reportQueue = new Queue('report generate', {
    redis: {
        port: Number(RedisConfig.port),
        host: RedisConfig.host,
        password: RedisConfig.password
    }
})