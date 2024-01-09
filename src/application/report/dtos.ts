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