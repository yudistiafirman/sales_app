import EntryType from "./EnumModel";

interface Login {
    phone: string;
    otp?: string;
}

interface DataSuccessLogin {
    accessToken: string;
    phone: string;
    id: string;
    email: string;
    type: EntryType;
}

export default class UserModel {
    Login;

    DataSuccessLogin;
}
