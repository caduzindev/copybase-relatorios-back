export interface IDate {
    convertToFormat(date: string, forConvert: string, toFormat: string): string;
    getMonth(date: Date | string): string;
    getYear(date: Date | string): string;
}