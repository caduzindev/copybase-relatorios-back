import { Report } from "../../../../domain/entities/report/Report";
import { IReportRepository } from "../../../../domain/repositories/report/IReportRepository";
import { mapperToDB, mapperDbToReport } from "./mapper";
import { ReportModel } from "./schema";

export class ReportRepositoryMongo implements IReportRepository {
    async save<T>(report: Report<T>): Promise<Report<T>> {
        const reportToDb = mapperToDB(report);
        const saved = await ReportModel.create(reportToDb);
        return mapperDbToReport(saved);
    }
}