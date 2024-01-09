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

    async findById<T>(reportId: string): Promise<Report<T> | null> {
        const reportDb = await ReportModel.findById(reportId);
        if (reportDb) {
            return mapperDbToReport(reportDb)
        }
        return null;
    }

    async update<T>(reportId: string, report: Report<T>): Promise<void> {
        const reportToDb = mapperToDB(report);
        await ReportModel.updateOne({ _id: reportId }, reportToDb )
    }
}