import mongoose, { Schema } from "mongoose";

export interface IReportMongo {
    _id: string;
    filePath: string;
    status: number;
    result?: string;
}

const ReportSchemaMongo = new Schema<IReportMongo>({
    filePath: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true
    },
    result: String
}, { timestamps: true })

export const ReportModel = mongoose.model<IReportMongo>('Report', ReportSchemaMongo);