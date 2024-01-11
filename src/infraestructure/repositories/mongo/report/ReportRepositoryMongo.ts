import { Report } from "../../../../domain/entities/report/Report";
import { IReportRepository } from "../../../../domain/repositories/report/IReportRepository";
import { mapperToDB, mapperDbToReport, mapperDbToReportCollection, mapperToFilter } from "./mapper";
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

    async list<T>(page: number, filter: Report<T>, limit: number = 10): Promise<Report<T>[]> {
        const reportToDb = mapperToFilter(filter);

        const indexStart = (page - 1) * limit
        const reports = await ReportModel.find(reportToDb)
            .limit(limit)
            .skip(indexStart)
            .sort([['createdAt', 'desc']])

        return mapperDbToReportCollection(reports)
    }

    async count<T>(filter?: Report<T>): Promise<number> {
        if (filter){
            const reportToDb = mapperToFilter(filter)
            return ReportModel.countDocuments(reportToDb)
        }
        return ReportModel.countDocuments()
    }
}