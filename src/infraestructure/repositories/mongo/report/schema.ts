import mongoose, { Schema } from "mongoose";

export interface IReportMongo {
    _id: string;
    fileName: string;
    status: number;
    result?: string;
}

const ReportSchemaMongo = new Schema<IReportMongo>({
    fileName: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true
    },
    result: String
})

export const ReportModel = mongoose.model<IReportMongo>('Report', ReportSchemaMongo);