import { Report } from "../../../../domain/entities/report/Report"
import { IReportMongo } from "./schema"

export const mapperToDB = <T>(report: Report<T>): Omit<IReportMongo, '_id'> => {
    return {
        fileName: report.fileName,
        status: report.status,
        ...(report.resultProcess && { result: JSON.stringify(report.resultProcess) })
    }
}

export const mapperDbToReport = <T>(reportMongo: IReportMongo): Report<T> => {
    return {
        id: reportMongo._id,
        fileName: reportMongo.fileName,
        status: reportMongo.status,
        ...(reportMongo.result && { resultProcess: reportMongo.result && JSON.parse(reportMongo.result) })
    }
}