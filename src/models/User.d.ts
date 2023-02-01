export namespace UserModel {
  export interface Login {
    phone: string;
    otp?: string;
  }

  export interface DataSuccessLogin {
    accessToken: string;
    phone: string;
    id: string;
    email: string;
    type: 'ADMIN' | 'MOBILE';
  }
}
