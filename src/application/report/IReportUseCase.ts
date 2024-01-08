export interface IReportUseCase {
    requestReport(fileContent: ReadableStream): Promise<void>;
}