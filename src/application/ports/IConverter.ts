import { Readable } from 'stream'
export interface IConverter {
    csvToJsonStream(path: string): Readable;
}