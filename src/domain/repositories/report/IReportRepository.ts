import { Report } from "../../entities/report/Report";

export interface IReportRepository {
    save<T>(report: Report<T>): Promise<void>;
}