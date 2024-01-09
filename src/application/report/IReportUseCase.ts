export interface IReportUseCase {
    requestReport(filePath: string): Promise<void>;
    processReport(reportId: string): Promise<void>;
}