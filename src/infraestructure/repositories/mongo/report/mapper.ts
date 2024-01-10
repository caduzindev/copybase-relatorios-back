import { Report } from "../../../../domain/entities/report/Report"
import { IReportMongo } from "./schema"

export const mapperToDB = <T>(report: Report<T>): Omit<IReportMongo, '_id'> => {
    return {
        filePath: report.filePath,
        fileName: report.fileName,
        status: report.status,
        ...(report.resultProcess && { result: JSON.stringify(report.resultProcess) })
    }
}

export const mapperToFilter = <T>(report: Report<T>): Partial<IReportMongo> => {
    return {
        ...(report.filePath && { filePath: report.filePath }),
        ...(report.fileName && { fileName: report.fileName }),
        ...(report.status && { status: report.status }),
    }
}

export const mapperDbToReport = <T>(reportMongo: IReportMongo): Report<T> => {
    return {
        id: reportMongo._id,
        filePath: reportMongo.filePath,
        fileName: reportMongo.fileName,
        status: reportMongo.status,
        ...(reportMongo.result && { resultProcess: reportMongo.result && JSON.parse(reportMongo.result) })
    }
}

export const mapperDbToReportCollection = <T>(reportsMongo: IReportMongo[]): Report<T>[] => {
    return reportsMongo.map(reportMongo => mapperDbToReport(reportMongo))
}