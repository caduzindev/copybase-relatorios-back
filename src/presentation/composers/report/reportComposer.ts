import { ReportUseCase } from "../../../application/report/ReportUseCase";
import { ReportController } from "../../controllers/report/ReportController";
import { QueueManagerBull } from '../../../infraestructure/queues/bull/QueueMangerBull'
import { ReportRepositoryMongo } from '../../../infraestructure/repositories/mongo/report/ReportRepositoryMongo'
import { Converter } from '../../../utils/Converter'
import { DateFns } from '../../../utils/date/DateFns'

const dateManager = new DateFns()
const converter = new Converter()
const reportRepositoryMongo = new ReportRepositoryMongo()
const queueManagerBull = new QueueManagerBull();
const reportUseCase = new ReportUseCase(
    queueManagerBull, 
    reportRepositoryMongo, 
    converter,
    dateManager
)
const reportController = new ReportController(reportUseCase);

export { reportController }