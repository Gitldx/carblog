import { AccountRoleType } from "@src/core/userAccount/type";

export interface SignInFormData {
  username: string;
  password: string;
}


export interface SignUpFormData {
  accountName: string;
  // email: string;
  password: string;
  // termsAccepted: boolean;
  role : AccountRoleType;
}
