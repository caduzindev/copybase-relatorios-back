import { IReportUseCase } from "../../../application/report/IReportUseCase";
import { HttpRequestDTO, HttpResponseDTO } from "../../dtos/http";
import { IReportController } from "./IReportController";

export class ReportController implements IReportController {
    constructor(private readonly reportUseCase: IReportUseCase) {}
    async requestReport(request: HttpRequestDTO): Promise<HttpResponseDTO> {
        try {
            console.log(request);
            // const filePath = request.body.filePath;
            // await this.reportUseCase.requestReport(filePath);
            return {
                statusCode: 200,
                body: ''
            }
        } catch(error: any) {
            console.log(error)
            return {
                statusCode: 500,
                body: ''
            }
        }
    }
}