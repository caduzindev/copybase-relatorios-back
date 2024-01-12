import { ServerError } from "../errors/ServerError";
import { HttpResponseDTO } from "../presentation/dtos/http";

export class HttpResponse {
    static ok(body: any): HttpResponseDTO {
        return {
            statusCode: 200,
            body
        };
    }
    static badRequest(error: any): HttpResponseDTO {
        return {
            statusCode: 400,
            body: {
                error: {
                    erro: error.name,
                    message: error.message
                }
            }
        };
    }
    static serverError(): HttpResponseDTO {
        return {
            statusCode: 500,
            body: {
                error: {
                    erro: new ServerError().name,
                    message: new ServerError().message
                }
            }
        };
    }
}