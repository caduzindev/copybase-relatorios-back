import { IReportUseCase } from "../../../application/report/IReportUseCase";
import { HttpRequestDTO, HttpResponseDTO } from "../../dtos/http";
import { IReportController } from "./IReportController";

export class ReportController implements IReportController {
    constructor(private readonly reportUseCase: IReportUseCase) {}
    async requestReport(request: HttpRequestDTO): Promise<HttpResponseDTO> {
        try {
            const filePath = request.file?.path as string;
            await this.reportUseCase.requestReport(filePath);
            return {
                statusCode: 200,
                body: 'Arquivo enviado com sucesso!'
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