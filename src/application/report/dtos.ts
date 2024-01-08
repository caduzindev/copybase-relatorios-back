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