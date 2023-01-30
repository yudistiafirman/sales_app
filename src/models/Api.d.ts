import { UserModel } from './User';

export namespace Api {
  export interface Response {
    success: boolean;
    message: string;
    data?: any | UserModel.DataSuccessLogin;
    error?: {
      code: string;
      message: string;
      status: number;
    };
  }
}
