import type { IParticipant } from "@/domain/IParticipant";
import { BaseApiService } from "./BaseApiService";

export class ParticipantApiService extends BaseApiService<IParticipant> {
    constructor() {
        super("Participants");
    }
}