import { Report } from "../../domain/entities/report/Report";
import { StatusReport } from "../../domain/enum/report/StatusReport";

export interface MetricsReport {
    mrr: {
        months: string[],
        values: number[]
    },
    churnRate: {
        months: string[],
        values: number[]
    },
}

export interface MetricsReportError {
    reason: string;
    error: true
}

export interface ReportListFilter {
    status?: StatusReport,
}

export type ReportMetricResult = MetricsReport | MetricsReportError
export interface ReportReturnPagination {
    data: Report<ReportMetricResult>[];
    currentPage: number;
    totalPages: number;
}