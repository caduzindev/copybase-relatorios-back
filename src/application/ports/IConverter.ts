import { Readable } from 'stream'
import { ReportFileStructure } from '../../domain/entities/report/Report';
export interface IConverter {
    csvToJsonStream(path: string): Readable;
    csvToReportFileStructure(path: string): Promise<ReportFileStructure[]>;
}