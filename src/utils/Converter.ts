import { Readable } from "stream";
import { IConverter } from "../application/ports/IConverter";
import { createReadStream } from 'fs'
import csv from 'csv-parser'
import { InvalidParams } from "../errors/BusinessError";
import { ReportFileStructure } from "../domain/entities/report/Report";
import { ReportFileStructurePeriody, ReportFileStructureStatus } from "../domain/enum/report/ReportFileStructure";

export class Converter implements IConverter{
    csvToJsonStream(path: string): Readable {
        return createReadStream(path).pipe(csv())
    }
    async csvToReportFileStructure(path: string): Promise<ReportFileStructure[]> {
        const data: ReportFileStructure[] = []
        
        return new Promise((resolve, reject) => {
            const stream = this.csvToJsonStream(path);
            stream
                .on('data', (row) => {
                    const amount = parseFloat(row['valor'].replace(',', '.')) || 0;
                    const amountOfCharges = parseInt(row['quantidade cobranças']) || 0;
    
                    const periody = row['periodicidade'] === 'Anual' 
                        ? ReportFileStructurePeriody.YEARLY 
                        : ReportFileStructurePeriody.MONTLY
    
                    const activeStatus = ['ATIVA','UPGRADE','ATRASADA']
                    const canceledStatus = ['CANCELADA', 'TRIAL CANCELADO']
    
                    const active = activeStatus.includes(row['status'].toUpperCase().trim())
                    const canceled = canceledStatus.includes(row['status'].toUpperCase().trim())
                    let status;
                    if (active) status = ReportFileStructureStatus.ACTIVE
                    if (canceled) status = ReportFileStructureStatus.CANCELED
                    if (!status) {
                        reject(new InvalidParams(`Status invalido para assinante ${row['ID assinante']}`))
                        return;
                    }
    
                    const reportFileStructure: ReportFileStructure = {
                        startDate: row['data início'],
                        amount: amount,
                        quantityOfCharges: amountOfCharges,
                        cancelDate: row['data cancelamento'],
                        lastStatusDate: row['data status'],
                        periody,
                        status
                    }
    
                    data.push(reportFileStructure);
                })
                .on('end',() => {
                    resolve(data)
                })
        })
    }
}