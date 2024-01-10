import { ReportListFilter, ReportReturnPagination } from "./dtos";

export interface IReportUseCase {
    requestReport(filePath: string, fileName: string): Promise<void>;
    processReport(reportId: string): Promise<void>;
    list(page: number, filter: ReportListFilter): Promise<ReportReturnPagination>
}