import { IReportUseCase } from "../../../../application/report/IReportUseCase";
import { reportQueue } from "./queue";

export const reportProcess = (reportUseCase: IReportUseCase) =>{
    return () => {
        reportQueue.process(function(job,done) {
            const reportId = job.data.reportId as string;
            reportUseCase.processReport(reportId)
                .then(() => done())
                .catch(error => {
                    done(error)
                })
        })
    }
}