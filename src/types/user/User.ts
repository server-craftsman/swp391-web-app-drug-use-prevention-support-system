export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  gender: "Male" | "Female" | string;
  dob: string;
  role: "user" | "admin" | "moderator" | string;
  ageGroup: "adult" | "teen" | "youth" | string;
  isVerified: boolean;
  isDeleted: boolean;
  verificationToken: string;
  verificationTokenExpires: string | null;
  createdAt: string;
  updatedAt: string;
  profilePicUrl: string;
}
