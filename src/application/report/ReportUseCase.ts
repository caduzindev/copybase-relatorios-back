import { IQueue, TargetQueue } from "../ports/IQueue";
import { IReportUseCase } from "./IReportUseCase";
import { IReportRepository } from "../../domain/repositories/report/IReportRepository"
import { Report } from "../../domain/entities/report/Report";
import { StatusReport } from "../../domain/enum/report/StatusReport";
export class ReportUseCase implements IReportUseCase {
    constructor(
        private readonly queue: IQueue,
        private readonly reportRepository: IReportRepository
    ) {}

    async requestReport(fileContent: ReadableStream<any>): Promise<void> {
        const reportToSave = new Report({
            fileName: 'random',
            status: StatusReport.PROCESSING,
        })
        const saved = await this.reportRepository.save(reportToSave);

        const sendToQueue = {
            reportId: saved.id,
            fileContent
        }
        await this.queue.enqueue(TargetQueue.REQUEST_REPORT, sendToQueue);
    }
}