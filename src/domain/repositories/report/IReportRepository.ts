import { Report } from "../../entities/report/Report";

export interface IReportRepository {
    save<T>(report: Report<T>): Promise<Report<T>>;
    findById<T>(reportId: string): Promise<Report<T> | null>;
    update<T>(reportId: string, report: Partial<Report<T>>): Promise<void>;
    list<T>(page:number, filter: Report<T>, limit: number): Promise<Report<T>[]>;
    count<T>(filter?: Report<T>): Promise<number>;
}