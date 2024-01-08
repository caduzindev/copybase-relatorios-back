import Queue from 'bull'

export const reportQueue = new Queue('report generate', process.env.REDIS_URL as string)