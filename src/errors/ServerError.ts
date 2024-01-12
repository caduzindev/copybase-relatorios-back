import { ErrorCodes } from "./ErrorCodes";

export class ServerError extends Error {
    constructor(paramName?: any) {
        super(paramName || 'Internal Error');
        this.name = ErrorCodes.SERVER_ERROR;
    }
}