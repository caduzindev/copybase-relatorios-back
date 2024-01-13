import { IReportUseCase } from "../../../application/report/IReportUseCase";
import { HttpResponse } from "../../../helpers/HttpResponse.";
import { MapperHttpError } from "../../../helpers/MapperHttpError";
import { HttpRequestDTO, HttpResponseDTO } from "../../dtos/http";
import { IReportController } from "./IReportController";

export class ReportController implements IReportController {
    constructor(private readonly reportUseCase: IReportUseCase) {}
    async requestReport(request: HttpRequestDTO): Promise<HttpResponseDTO> {
        try {
            const filePath = request.file?.path as string;
            const fileName = request.file?.name as string;
            await this.reportUseCase.requestReport(filePath, fileName);
            return HttpResponse.ok('Arquivo enviado com sucesso!')
        } catch(error: any) {
            console.log(error)
            const httpError = MapperHttpError.toHttpResponse(error);
            return httpError;
        }
    }

    async list(request: HttpRequestDTO): Promise<HttpResponseDTO> {
        try {
            const query = request.query;
            const reports = await this.reportUseCase.list(query.page, query)
            return HttpResponse.ok(reports)
        } catch(error: any) {
            console.log(error)
            const httpError = MapperHttpError.toHttpResponse(error);
            return httpError;
        }
    }
}