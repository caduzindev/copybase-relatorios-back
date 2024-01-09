import { IQueue, TargetQueue } from "../ports/IQueue";
import { IReportUseCase } from "./IReportUseCase";
import { IReportRepository } from "../../domain/repositories/report/IReportRepository"
import { Report } from "../../domain/entities/report/Report";
import { StatusReport } from "../../domain/enum/report/StatusReport";
import { MetricsReport } from "./dtos";
import { IConverter } from "../ports/IConverter";
import { IDate } from "../ports/IDate";
export class ReportUseCase implements IReportUseCase {
    constructor(
        private readonly queue: IQueue,
        private readonly reportRepository: IReportRepository,
        private readonly converter: IConverter,
        private readonly dateManager: IDate,
    ) {}

    async requestReport(filePath: string): Promise<void> {
        const reportToSave = new Report({
            filePath,
            status: StatusReport.PROCESSING,
        })
        const saved = await this.reportRepository.save(reportToSave);

        const sendToQueue = {
            reportId: saved.id,
        }

        await this.queue.enqueue(TargetQueue.REQUEST_REPORT, sendToQueue);
    }

    async processReport(filePath: string): Promise<MetricsReport> {
        let data: any = []
        const streamJson = this.converter.csvToJsonStream(filePath)

        return new Promise((resolve, reject) => {
            streamJson
                .on('data', (data) => data.push(data))
                .on('end', () => {
                    try {
                        const monthlyData: Record<string, {
                            MRR: number,
                            churnRate: number,
                            activeSubscriptions: number,
                            canceledSubscriptions: number
                        }> = {};
                        data.forEach((row) => {
                            const convertDate = this.dateManager.convertToFormat(
                                row['data início'],
                                'M/d/yy H:mm',
                                'yyyy-MM-dd'
                            )
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
                
                        let labels: string[] = []
                        let resultMrr: number[] = []
                        let resultChurnRate: number[] = []
                
                        combinedData.forEach(item => {
                            labels.push(item.date)
                            resultMrr.push(item.mrr)
                            resultChurnRate.push(item.churnRate * 100)
                        })
                        
                        resolve({
                            mrr: {
                                months: labels,
                                values: resultMrr,
                            },
                            churnRate: {
                                months: labels,
                                values: resultChurnRate,
                            },
                        });
                    } catch(err) {
                        console.log(err)
                        reject(err)
                    }
                })
        })
    }
}