import { Router } from 'express'
import report from './report'

const router = Router()

router.use('/report', report)

export default router;
