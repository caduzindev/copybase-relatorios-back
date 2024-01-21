import { IQueue, TargetQueue } from "../ports/IQueue";
import { IReportUseCase } from "./IReportUseCase";
import { IReportRepository } from "../../domain/repositories/report/IReportRepository"
import { Report, ReportFileStructure } from "../../domain/entities/report/Report";
import { StatusReport } from "../../domain/enum/report/StatusReport";
import { MetricsReport, MetricsReportError, ProcessReportAllReturn, ReportListFilter, ReportMetricResult, ReportReturnPagination } from "./dtos";
import { IConverter } from "../ports/IConverter";
import { IDate } from "../ports/IDate";
import { BusinessError } from "../../errors/BusinessError";
import { ReportFileStructurePeriody, ReportFileStructureStatus } from "../../domain/enum/report/ReportFileStructure";
export class ReportUseCase implements IReportUseCase {
    constructor(
        private readonly queue: IQueue,
        private readonly reportRepository: IReportRepository,
        private readonly converter: IConverter,
        private readonly dateManager: IDate,
    ) {}

    async requestReport(filePath: string, fileName: string): Promise<void> {
        if (!filePath) throw new BusinessError('Parametro filePath esta vazio ou inexistente')
        if (!fileName) throw new BusinessError('Parametro fileName esta vazio ou inexistente')

        const reportToSave = new Report({
            filePath,
            fileName,
            status: StatusReport.PROCESSING,
        })
        const saved = await this.reportRepository.save(reportToSave);

        const sendToQueue = {
            reportId: saved.id,
        }

        await this.queue.enqueue(TargetQueue.REQUEST_REPORT, sendToQueue);
    }

    async processReport(reportId: string): Promise<void> {
        try {
            const report = await this.reportRepository.findById(reportId);
            if (!report) throw new BusinessError(`Relatorio ${reportId} não encontrado`)

            const rows = await this.converter.csvToReportFileStructure(report.filePath);
            const resultReport = this.processReportAllReport(rows)
    
            const monthyData = Object.keys(resultReport);
            let mrrData: number[] = []
            let churnRateData: number[] = []
    
            monthyData.forEach((key) => {
                mrrData.push(resultReport[key].MRR)
                churnRateData.push(resultReport[key].churnRate)
            })
    
            const combinedData = monthyData.map((label, index) => ({
                date: label,
                mrr: mrrData[index],
                churnRate: churnRateData[index]
            }));

            combinedData.sort((a, b) => {
                const left = this.dateManager.convertToDateMilliseconds(a.date);
                const right = this.dateManager.convertToDateMilliseconds(b.date);

                return left - right
            });
    
            let labels: string[] = []
            let resultMrr: number[] = []
            let resultChurnRate: number[] = []
    
            combinedData.forEach(item => {
                labels.push(item.date)
                resultMrr.push(Number(item.mrr.toFixed(2)))
                resultChurnRate.push(item.churnRate * 100)
            })
            
            const resultProcess: MetricsReport = {
                mrr: {
                    months: labels,
                    values: resultMrr,
                },
                churnRate: {
                    months: labels,
                    values: resultChurnRate,
                }
            }

            await this.reportRepository.update(reportId, {
                status: StatusReport.DONE,
                resultProcess 
            })
        } catch(err: any) {
            const resultProcess: MetricsReportError = {
                error: true,
                reason: err.message as string
            }
            await this.reportRepository.update(reportId, {
                status: StatusReport.ERROR, 
                resultProcess
            })
        }
    }
    private processReportAllReport(rows: ReportFileStructure[]): ProcessReportAllReturn{
        const monthlyData: Record<string, {
            MRR: number,
            churnRate: number,
            activeSubscriptions: number,
            canceledSubscriptions: number,
        }> = {};
        const monthLabels: string[] = []

        rows.forEach((row: ReportFileStructure) => {
            const convertStartDate = this.dateManager.convertToDate(row.startDate);
            const convertLastStatusDate = this.dateManager.convertToDate(row.lastStatusDate);

            const quantityOfCharges = row.periody === ReportFileStructurePeriody.YEARLY
                ? this.dateManager.differenceMonthsBetweenDates(convertStartDate, convertLastStatusDate)
                : row.quantityOfCharges
            
            for (let quantity = 0;quantity <= quantityOfCharges;quantity++) {
                const plusOneMonthDate = this.dateManager.plusMonthsToJsDate(convertStartDate, quantity);
                const dateKey = this.generateKeyPerDate(plusOneMonthDate)
                const mrr = Report.calcAmountMrrForPeriody(row.periody, row.amount);
                if (!monthlyData[dateKey]) {
                    monthlyData[dateKey] = {
                        MRR: 0,
                        churnRate: 0,
                        activeSubscriptions: 0,
                        canceledSubscriptions: 0,
                    };
                    monthLabels.push(dateKey)
                }

                const convertCancelDate = this.dateManager.convertToDate(row.cancelDate);
                const reachCancelDate = ReportFileStructureStatus.ACTIVE 
                    && plusOneMonthDate.getTime() === convertCancelDate.getTime()

                if (reachCancelDate) break

                monthlyData[dateKey].MRR += mrr;

                if (row.status === ReportFileStructureStatus.ACTIVE) {
                    monthlyData[dateKey].activeSubscriptions++;
                }
            }
            
            if (row.status === ReportFileStructureStatus.CANCELED) {
                const convertCancelDate = this.dateManager.convertToDate(row.cancelDate);
                const dateKey = this.generateKeyPerDate(convertCancelDate)
                monthlyData[dateKey].canceledSubscriptions++
            }
        });
        monthLabels.forEach((month) => {
            const actualMonth = monthlyData[month]
            monthlyData[month].churnRate = actualMonth.canceledSubscriptions / actualMonth.activeSubscriptions
        });

        return monthlyData
    }
    private generateKeyPerDate(date: Date): string {
        const year = this.dateManager.getYear(date)
        const month = this.dateManager.getMonth(date);

        const key = `${year}-${month}`;
        return key;
    }

    async list(page: number, filter: ReportListFilter): Promise<ReportReturnPagination> {
        const reportFilter = {} as Report<ReportMetricResult>
        const limit = 10;

        if (filter.status) {
            reportFilter.status = filter.status;
        }

        const reports = await this.reportRepository.list(page || 1, reportFilter, limit);
        const totalReports = await this.reportRepository.count(reportFilter);

        return {
            data: reports,
            currentPage: page || 1,
            totalPages: Math.ceil(totalReports / limit) || 1
        }
    }
}