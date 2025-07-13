import type { CourseStatus } from "../../app/enums/courseStatus.enum";
import type { CourseTargetAudience } from "../../app/enums/courseTargetAudience.enum";
import type { RiskLevel } from "../../app/enums/riskLevel.enum";

export interface CourseRequest {
  pageNumber: number;
  pageSize: number;
  filterByName?: string;
  keyword?: string;
  userId?: string;
}
export interface CreateCourseRequest {
  name: string;
  categoryId: string;
  content: string;
  status: CourseStatus;
  targetAudience: CourseTargetAudience;
  videoUrls: string[];
  imageUrls: string[];
  price: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  riskLevel: RiskLevel;
}

export interface UpdateCourseRequest {
  id: string;
  name: string;
  categoryId: string;
  content: string;
  status: CourseStatus;
  targetAudience: CourseTargetAudience;
  videoUrls: string[];
  imageUrls: string[];
  price: number;
  discount: number;
  updatedAt: string;
  slug: string;
  userId: string;
  riskLevel: RiskLevel;
}
export interface DeleteCourseRequest {
  id: string;
}

export interface CourseDetailRequest {
  id: string;
  userId?: string; // Optional, for fetching user-specific data like purchase status
}
export interface MyCoursesRequest {
  userId: string;
}
