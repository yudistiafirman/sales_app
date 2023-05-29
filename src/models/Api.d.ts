import UserModel from "./User";
import * as Visitation from "./Visitation";

export interface Response {
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
