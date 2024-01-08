import { Queue } from "bull";
import { IQueue, TargetQueue } from "../../../application/ports/IQueue";
import { reportQueue } from "./report/queue";

const mapToQueue = new Map<TargetQueue, Queue>([
    [TargetQueue.REQUEST_REPORT, reportQueue]
])

export class QueueManagerBull implements IQueue {
    async enqueue<T>(target: TargetQueue, data: T): Promise<void> {
        const queue = mapToQueue.get(target)
        if (queue) {
            queue.add(data);
        }
    }
}