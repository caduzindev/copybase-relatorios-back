import { HttpRequestDTO, HttpResponseDTO } from "../../dtos/http";

export interface IReportController {
    requestReport(request: HttpRequestDTO): Promise<HttpResponseDTO>;
}