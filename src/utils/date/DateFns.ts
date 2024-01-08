import { IDate } from "../../application/ports/IDate";
import { format, getMonth, getYear, parse } from 'date-fns';

export class DateFns implements IDate {
    convertToFormat(date: string, forConvert: string, toFormat: string): string {
        return format(parse(date, forConvert, new Date()), toFormat)
    }

    getMonth(date: Date | string): string {
        if (typeof date === 'string') {
            return (getMonth(date) + 1).toString();
        } else {
            return (getMonth(new Date(date)) + 1).toString();
        }
    }

    getYear(date: string | Date): string {
        if (typeof date === 'string') {
            return (getYear(date)).toString();
        } else {
            return getYear(new Date(date)).toString();
        }
    }
}