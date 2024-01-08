export enum TargetQueue {
    REQUEST_REPORT = 'REQUEST_REPORT' 
}
export interface IQueue {
    enqueue<T>(target:TargetQueue, data: T): Promise<void>;
}