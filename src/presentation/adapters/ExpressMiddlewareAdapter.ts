import { NextFunction, Request, Response } from "express";
import { HttpRequestDTO } from "../dtos/http";

export class ExpressMiddlewareAdapter {
    static adapt(middleware: any, method: string) {
        return async (request: Request, response: Response, next: NextFunction) => {
            const httpRequest: HttpRequestDTO = {
                body: request.body,
                params: request.params,
                query: request.query,
                headers: request.headers,
                ...(request.file && { 
                    file: {
                        path: request.file.path,
                        name: request.file.originalname
                    } 
                })
            };            
            const httpResponse = await middleware[method](httpRequest);
            if (httpResponse === null) {
                return next();
            }
            if(httpResponse && typeof httpResponse.statusCode == 'undefined'){
                request.body = httpResponse;
                return next();
            }
            response.status(httpResponse.statusCode).json(httpResponse.body);
        };
    }
}