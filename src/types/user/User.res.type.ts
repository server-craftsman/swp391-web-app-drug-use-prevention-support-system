import type { UserRole } from "../../app/enums";

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  gender: string;
  email: string;
  dob: string;
  ageGroup: string;
  token?: string;
  isVerified: boolean;
  isDeleted: boolean;
  verificationToken: string;
  verificationTokenExpires: Date;
  role: UserRole;
  profilePicUrl: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}
export interface UserPageInfo {
  pageNum: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface UserListResponse {
  pageData: UserResponse[];
  pageInfo: UserPageInfo;
}
