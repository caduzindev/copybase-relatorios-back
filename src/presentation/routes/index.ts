import { Router } from 'express'
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import report from './report'
import { options } from './swagger/options';

const router = Router()

const specs = swaggerJsdoc(options);
router.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(specs));

router.use('/report', report)

export default router;
