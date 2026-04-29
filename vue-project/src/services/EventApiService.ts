import type { IEvent } from "@/domain/IEvent";
import { BaseApiService } from "./BaseApiService";

export class EventApiService extends BaseApiService<IEvent> {
    constructor() {
        super("Events");
    }
}