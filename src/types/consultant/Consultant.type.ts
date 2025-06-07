export interface Consultant {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  qualifications: string[]; // là Array như bạn đã mô tả
  jobTitle: string;
  hireDate: string; // ISO datetime string, ví dụ: "2023-01-10T00:00:00Z"
  salary: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  avatar: string;
}
