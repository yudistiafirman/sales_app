import { UserModel } from './User';
import { VisitationModel } from './Visitation';

export namespace Api {
  export interface Response {
    success?: boolean;
    message?: string;
    currentPage?: number;
    totalPage?: number;
    totalItems?: number;
    data?: any | UserModel.DataSuccessLogin | VisitationModel.DataGetAllVisitation;
    error?: {
      code: string;
      message: string;
      status: number;
    };
  }
}
