export interface IEvent {
    id: string,
    eventName: string,
    startTime: Date,
    endTime: Date,
    maxParticipants: number,
    spotsLeft: number
};

export type Events = IEvent[];