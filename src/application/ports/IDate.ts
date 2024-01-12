export interface IDate {
    convertToDate(date: string): Date;
    convertToDateMilliseconds(date: string): number;
    getMonth(date: Date | string): string;
    getYear(date: Date | string): string;
    plusMonthsToJsDate(date: Date, months: number): Date;
    minusMonthsToJsDate(date: Date, months: number): Date;
    differenceMonthsBetweenDates(left: Date, right: Date): number
}