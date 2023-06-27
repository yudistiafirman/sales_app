import EntryType from "./EnumModel";

export interface Login {
    phone: string;
    otp?: string;
}

export interface DataSuccessLogin {
    accessToken: string;
    phone: string;
    id: string;
    email: string;
    type?: EntryType;
    roles: string[];
}
