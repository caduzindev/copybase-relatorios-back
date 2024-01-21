import { ReportUseCase } from '../../../src/application/report/ReportUseCase'
import { IConverter } from "../../../src/application/ports/IConverter";
import { IDate } from "../../../src/application/ports/IDate";
import { IQueue } from "../../../src/application/ports/IQueue";
import { IReportRepository } from "../../../src/domain/repositories/report/IReportRepository"
import { addMonths, differenceInMonths, getMonth, getYear } from 'date-fns';

export const stub = () => {
    const dateManager: jest.Mocked<IDate> = {
        convertToDate: jest.fn().mockImplementation((date) => {
            return new Date(date)
        }),
        convertToDateMilliseconds: jest.fn().mockImplementation((date: string) => new Date(date).getTime()),
        differenceMonthsBetweenDates: jest.fn().mockImplementation((left: Date,right: Date) => {
            return Math.abs(differenceInMonths(left, right))
        }),
        getMonth: jest.fn().mockImplementation((date: string | Date) => {
            if (typeof date === 'string') {
                return (getMonth(date) + 1).toString();
            } else {
                return (getMonth(new Date(date)) + 1).toString();
            }
        }),
        getYear: jest.fn().mockImplementation((date: string | Date) => {
            if (typeof date === 'string') {
                return (getYear(date)).toString();
            } else {
                return getYear(new Date(date)).toString();
            }
        }),
        minusMonthsToJsDate: jest.fn(),
        plusMonthsToJsDate: jest.fn().mockImplementation((date: Date, months: number)=> {
            return addMonths(date, months)
        })
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