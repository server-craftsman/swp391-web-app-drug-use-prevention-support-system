import type { UserRole } from "../../app/enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  NewPassword: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  address: string;
  gender: string;
  dob: string;
  profilePicUrl?: string;
}

export interface GetUserByIdRequest {
  userId: string;
}
