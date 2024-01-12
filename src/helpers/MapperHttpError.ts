import { ErrorCodes } from "../errors/ErrorCodes";
import { HttpResponseDTO } from "../presentation/dtos/http";
import { HttpResponse } from "./HttpResponse.";

export class MapperHttpError {
    private static recoverableErros = new Set<string>([
        ErrorCodes.BUSINESS_ERROR,
        ErrorCodes.INVALID_PARAMS,
    ]);

    static toHttpResponse(error: Error): HttpResponseDTO {
        if (this.recoverableErros.has(error.name)) return HttpResponse.badRequest(error);
        return HttpResponse.serverError();
    }
}