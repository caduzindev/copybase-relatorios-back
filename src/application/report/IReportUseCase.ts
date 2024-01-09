import { MetricsReport } from "./dtos";

export interface IReportUseCase {
    requestReport(filePath: string): Promise<void>;
    processReport(reportId: string): Promise<MetricsReport>;
}