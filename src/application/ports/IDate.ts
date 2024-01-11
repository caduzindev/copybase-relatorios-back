export interface IDate {
    convertToDate(date: string): Date;
    convertToDateMilliseconds(date: string): number;
    getMonth(date: Date | string): string;
    getYear(date: Date | string): string;
}