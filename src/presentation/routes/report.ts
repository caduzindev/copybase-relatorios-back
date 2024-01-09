import { Router } from 'express'
import { ExpressMulterAdapter } from '../adapters/ExpressMulterAdapter';
import { ExpressMiddlewareAdapter } from '../adapters/ExpressMiddlewareAdapter';
import { reportController } from '../composers/report/reportComposer';

const report = Router();

report.post('/v1/request', 
    ExpressMulterAdapter.adapt('uploadReport'),
    ExpressMiddlewareAdapter.adapt(reportController, 'requestReport')
)

report.get('/v1/list', ExpressMiddlewareAdapter.adapt(reportController, 'list'))

export default report;