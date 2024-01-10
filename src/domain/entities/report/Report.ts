import { StatusReport } from "../../enum/report/StatusReport";

export class Report<T> {
    id?: string;
    filePath: string;
    fileName: string;
    status: StatusReport
    resultProcess?: T;

    constructor(report: Report<T>) {
        this.id = report.id;
        this.filePath = report.filePath;
        this.fileName = report.fileName;
        this.status = report.status;
        this.resultProcess = report.resultProcess;
    }
}