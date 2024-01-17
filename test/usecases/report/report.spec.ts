import { TargetQueue } from '../../../src/application/ports/IQueue'
import { Report } from '../../../src/domain/entities/report/Report'
import { StatusReport } from '../../../src/domain/enum/report/StatusReport'
import { stub } from './stub'

describe('ReportUseCase Test', () => {
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