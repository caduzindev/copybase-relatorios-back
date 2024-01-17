import { ReportUseCase } from '../../../src/application/report/ReportUseCase'
import { IConverter } from "../../../src/application/ports/IConverter";
import { IDate } from "../../../src/application/ports/IDate";
import { IQueue } from "../../../src/application/ports/IQueue";
import { IReportRepository } from "../../../src/domain/repositories/report/IReportRepository"

export const stub = () => {
    const dateManager: jest.Mocked<IDate> = {
        convertToDate: jest.fn(),
        convertToDateMilliseconds: jest.fn(),
        differenceMonthsBetweenDates: jest.fn(),
        getMonth: jest.fn(),
        getYear: jest.fn(),
        minusMonthsToJsDate: jest.fn(),
        plusMonthsToJsDate: jest.fn()
    }

    const converter: jest.Mocked<IConverter> = {
        csvToJsonStream: jest.fn(),
        csvToReportFileStructure: jest.fn()
    }

    const reportRepository: jest.Mocked<IReportRepository> = {
        count: jest.fn(),
        findById: jest.fn(),
        list: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    }
    const queue: jest.Mocked<IQueue> = {
        enqueue: jest.fn()
    }

    const reportUseCase = new ReportUseCase(
        queue, 
        reportRepository, 
        converter,
        dateManager
    )

    return {
        reportUseCase,
        dateManager,
        converter,
        reportRepository,
        queue
    }
}