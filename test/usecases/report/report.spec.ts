import { TargetQueue } from '../../../src/application/ports/IQueue'
import { MetricsReport } from '../../../src/application/report/dtos'
import { Report, ReportFileStructure } from '../../../src/domain/entities/report/Report'
import { ReportFileStructurePeriody, ReportFileStructureStatus } from '../../../src/domain/enum/report/ReportFileStructure'
import { StatusReport } from '../../../src/domain/enum/report/StatusReport'
import { stub } from './stub'

describe('ReportUseCase Test', () => {
    describe('requestReport function', () => {
        test('Request report success', async () => {
            const { reportUseCase, reportRepository, queue } = stub()
            const filePath = 'path/to/teste.csv'
            const fileName = 'teste.csv'
    
            const saveReport = jest.spyOn(reportRepository, 'save').mockResolvedValueOnce(
                new Report({
                    fileName,
                    filePath,
                    status: StatusReport.PROCESSING,
                    id: '1234'
                })
            )
    
            const enqueueReport = jest.spyOn(queue, 'enqueue')
    
            await reportUseCase.requestReport(filePath, fileName)
    
            expect(saveReport).toHaveBeenCalledWith({
                filePath,
                fileName,
                status: StatusReport.PROCESSING
            })
    
            expect(enqueueReport).toHaveBeenCalledWith(TargetQueue.REQUEST_REPORT, {
                reportId: '1234'
            })
        })
    
        test('Request report fail without filePath', async () => {
            const { reportUseCase } = stub()
            const filePath = ''
            const fileName = 'teste.csv'
    
            expect(async () => {
                await reportUseCase.requestReport(filePath, fileName)
            }).rejects.toThrow("Parametro filePath esta vazio ou inexistente")
        })
    
        test('Request report fail without fileName', async () => {
            const { reportUseCase } = stub()
            const filePath = 'path/to/teste.csv'
            const fileName = ''
    
            expect(async () => {
                await reportUseCase.requestReport(filePath, fileName)
            }).rejects.toThrow("Parametro fileName esta vazio ou inexistente")
        })
    })
    describe('processReport function', () => {
        test('reportId not found', async () => {
            const reportId = '1234'
            const resultMetric = {
                status: StatusReport.ERROR,
                resultProcess: {
                    error: true,
                    reason: `Relatorio ${reportId} não encontrado`
                }
            }
            const { reportUseCase, reportRepository } = stub()
    
            const findByIdReport = jest.spyOn(reportRepository, 'findById').mockResolvedValueOnce(null)
    
            const updateReport = jest.spyOn(reportRepository, 'update')
    
            await reportUseCase.processReport(reportId);
    
            expect(findByIdReport).toHaveBeenCalledWith(reportId)
    
            expect(updateReport).toHaveBeenCalledWith(reportId, resultMetric)
        })

        test('process report sucess', async () => {
            const { reportUseCase, reportRepository, converter } = stub()
            const report = new Report({
                fileName: 'teste.csv',
                filePath: 'path/to',
                status: StatusReport.PROCESSING,
                id: '123'
            })

            const parseCsvToStructure: ReportFileStructure[] = [
                {
                    amount: 5049.37,
                    periody: ReportFileStructurePeriody.YEARLY,
                    startDate: '1/10/2022',
                    lastStatusDate: '2/10/2022',
                    status: ReportFileStructureStatus.ACTIVE,
                    cancelDate: '',
                    quantityOfCharges: 1
                },
                {
                    amount: 330,
                    periody: ReportFileStructurePeriody.MONTLY,
                    startDate: '1/20/2022',
                    status: ReportFileStructureStatus.CANCELED,
                    cancelDate: '2/20/2022',
                    lastStatusDate: '2/31/2022',
                    quantityOfCharges: 1
                }
            ]

            const resultProcess: MetricsReport = {
                mrr: {
                    months: ['2022-1', '2022-2'],
                    values: [750.78, 420.78],
                },
                churnRate: {
                    months: ['2022-1', '2022-2'],
                    values: [0,100],
                }
            }

            const findByIdReport = jest.spyOn(reportRepository, 'findById').mockResolvedValueOnce(report);
            const converterToJson = jest.spyOn(converter, 'csvToReportFileStructure').mockResolvedValueOnce(parseCsvToStructure)

            const updateReport = jest.spyOn(reportRepository, 'update')

            await reportUseCase.processReport(report.id as string);

            expect(findByIdReport).toHaveBeenCalledWith(report.id)
            expect(converterToJson).toHaveBeenCalledWith(report.filePath);

            expect(updateReport).toHaveBeenCalledWith(report.id, {
                status: StatusReport.DONE,
                resultProcess
            })
        })
    })
})