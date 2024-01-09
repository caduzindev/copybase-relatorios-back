import { ErrorCodes } from "./ErrorCodes";

export class BusinessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ErrorCodes.BUSINESS_ERROR;
    }
}