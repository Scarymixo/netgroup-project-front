export interface IParticipant {
    id: string,
    eventId: string,
    firstName: string,
    lastName: string,
    nationalId: string
}

export type Participants = IParticipant[];