export interface DataGetAllVisitation {
    id: string;
    visitationId?: string;
    order: number;
    dateVisit?: Date;
    finishDate?: Date;
    isBooking: boolean;
    status: string;
    project?: {
        id: string;
        name: string;
        stage: string;
        pic?: {
            id: string;
            name: string;
            position: string;
            phone: string;
            email: string;
            type: string;
        };
        company?: {
            id: string;
            name: string;
            displayName: string;
        };
        locationAddress?: {
            line1: string;
            rural: string;
            district: string;
            postalCode: number;
            city: string;
        };
    };
}
