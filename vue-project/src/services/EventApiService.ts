import type { IEvent } from "@/domain/IEvent";
import type { IParticipant } from "@/domain/IParticipant";
import { BaseApiService } from "./BaseApiService";
import { httpClient } from "./httpClient";

export class EventApiService extends BaseApiService<IEvent> {
    constructor() {
        super("Events");
    }

    async getParticipants(eventId: string): Promise<IParticipant[]> {
        const { data } = await httpClient.get<IParticipant[]>(`${this.url()}/${eventId}/Participants`);
        return data;
    }
}
