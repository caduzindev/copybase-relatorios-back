import { StatusReport } from "../../enum/report/StatusReport";

export class Report<T> {
    id?: string;
    filePath: string;
    status: StatusReport
    resultProcess?: T;

    constructor(report: Report<T>) {
        this.id = report.id;
        this.filePath = report.filePath;
        this.status = report.status;
        this.resultProcess = report.resultProcess;
    }
}