import { Readable } from "stream";
import { IConverter } from "../application/ports/IConverter";
import { createReadStream } from 'fs'
import csv from 'csv-parser'

export class Converter implements IConverter{
    csvToJsonStream(path: string): Readable {
        return createReadStream(path).pipe(csv())
    }
}