import UserModel from "./User";
import * as Visitation from "./Visitation";

interface Response {
    success?: boolean;
    message?: string;
    currentPage?: number;
    totalPage?: number;
    totalItems?: number;
    data?: any | UserModel.DataSuccessLogin | Visitation.DataGetAllVisitation;
    error?: {
        code: string;
        message: string;
        status: number;
    };
}

export default class Api {
    Response;
}
