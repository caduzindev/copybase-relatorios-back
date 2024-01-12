import { IDate } from "../../application/ports/IDate";
import { addMonths, differenceInMonths, getMonth, getYear, subMonths } from 'date-fns';

export class DateFns implements IDate {
    convertToDate(date: string): Date {
        return new Date(date);
    }

    convertToDateMilliseconds(date: string): number {
        return new Date(date).getTime();
    }

    getMonth(date: Date | string): string {
        if (typeof date === 'string') {
            return (getMonth(date) + 1).toString();
        } else {
            return (getMonth(new Date(date)) + 1).toString();
        }
    }

    plusMonthsToJsDate(date: Date, months: number): Date {
        return addMonths(date, months);
    }

    minusMonthsToJsDate(date: Date, months: number): Date {
        return subMonths(date, months);
    }

    getYear(date: string | Date): string {
        if (typeof date === 'string') {
            return (getYear(date)).toString();
        } else {
            return getYear(new Date(date)).toString();
        }
    }

    differenceMonthsBetweenDates(left: Date, right: Date): number {
        return Math.abs(differenceInMonths(left,right))
    }
}