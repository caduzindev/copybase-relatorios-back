import { IQueue, TargetQueue } from "../ports/IQueue";
import { IReportUseCase } from "./IReportUseCase";
import { IReportRepository } from "../../domain/repositories/report/IReportRepository"
import { Report } from "../../domain/entities/report/Report";
import { StatusReport } from "../../domain/enum/report/StatusReport";
import { MetricsReport, MetricsReportError, ReportListFilter, ReportMetricResult, ReportReturnPagination } from "./dtos";
import { IConverter } from "../ports/IConverter";
import { IDate } from "../ports/IDate";
import { BusinessError } from "../../errors/BusinessError";
export class ReportUseCase implements IReportUseCase {
    constructor(
        private readonly queue: IQueue,
        private readonly reportRepository: IReportRepository,
        private readonly converter: IConverter,
        private readonly dateManager: IDate,
    ) {}

    async requestReport(filePath: string, fileName: string): Promise<void> {
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
        let data: any = []
        try {
            const report = await this.reportRepository.findById(reportId);
            if (!report) throw new BusinessError(`Relatorio ${reportId} não encontrado`)

            const streamJson = this.converter.csvToJsonStream(report.filePath)
            return new Promise((resolve, reject) => {
                streamJson
                    .on('data', (chunk) => data.push(chunk))
                    .on('end', async () => {
                        try {
                            const monthlyData: Record<string, {
                                MRR: number,
                                churnRate: number,
                                activeSubscriptions: number,
                                canceledSubscriptions: number
                            }> = {};
                            data.forEach((row) => {
                                const convertDate = this.dateManager.convertToDate(row['data início'])
                                const year = this.dateManager.getYear(convertDate)
                                const month = this.dateManager.getMonth(convertDate);
            
                                const key = `${year}-${month}`;
                                if (!monthlyData[key]) {
                                    monthlyData[key] = {
                                        MRR: 0,
                                        churnRate: 0,
                                        activeSubscriptions: 0,
                                        canceledSubscriptions: 0,
                                    };
                                }
                        
                                const value = parseFloat(row['valor'].replace(',', '')) || 0;
                                const amountOfCharges = parseInt(row['quantidade cobranças']) || 1;
                                const mrr = value * amountOfCharges;
                        
                                monthlyData[key].MRR += row['periodicidade'] === 'Anual' ? mrr / 12 : mrr;
                        
                                if (row['status'] === 'Ativa' || row['status'] === 'Upgrade') {
                                    monthlyData[key].activeSubscriptions++;
                                } else if (row['status'] === 'Cancelada' || row['status'] === 'Trial cancelado') {
                                    const convertDate = this.dateManager.convertToDate(row['data cancelamento'])
                                    const cancelYear = this.dateManager.getYear(convertDate);
                                    const cancelMonth = this.dateManager.getMonth(convertDate);
                                    const cancelKey = `${cancelYear}-${cancelMonth}`;
                                    if (!monthlyData[cancelKey]) {
                                        monthlyData[cancelKey] = {
                                            MRR: 0,
                                            churnRate: 0,
                                            activeSubscriptions: 0,
                                            canceledSubscriptions: 0,
                                        };
                                    }
                                    monthlyData[key].canceledSubscriptions++;
                                }
                            });
            
                            Object.keys(monthlyData).forEach((key) => {
                                const { canceledSubscriptions,activeSubscriptions } = monthlyData[key];
                                monthlyData[key].churnRate = canceledSubscriptions / activeSubscriptions;
                            });
                    
                            const monthyData = Object.keys(monthlyData);
                            let mrrData: number[] = []
                            let churnRateData: number[] = []
                    
                            monthyData.forEach((key) => {
                                mrrData.push(monthlyData[key].MRR)
                                churnRateData.push(monthlyData[key].churnRate)
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
                                resultMrr.push(item.mrr)
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

                            resolve()
                        } catch(err: any) {
                            console.log(err)
                            const resultProcess: MetricsReportError = {
                                error: true,
                                reason: err.message as string
                            }
                            await this.reportRepository.update(reportId, {
                                status: StatusReport.ERROR, 
                                resultProcess
                            })
                            reject(err)
                        }
                    })
            })
        } catch(err: any) {
            console.log(err)
            const resultProcess: MetricsReportError = {
                error: true,
                reason: err.message as string
            }
            await this.reportRepository.update(reportId, {
                status: StatusReport.ERROR, 
                resultProcess
            })
            throw err;
        }
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