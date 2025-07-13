import type { CourseStatus } from "../../app/enums/courseStatus.enum";
import type { CourseTargetAudience } from "../../app/enums/courseTargetAudience.enum";
import type { RiskLevel } from "../../app/enums/riskLevel.enum";

export interface Course {
  id: string;
  name: string;
  userId: string;
  categoryId: string;
  content: string;
  status: CourseStatus;
  targetAudience: CourseTargetAudience;
  imageUrls: string[];
  videoUrls: string[];
  price: number;
  discount: number;
  slug: string;
  createdAt: string;
  riskLevel: RiskLevel;
  isPurchased?: boolean;
}

export interface CoursePageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CourseListResponse {
  pageData: Course[];
  pageInfo: CoursePageInfo;
}
export interface CourseLesson {
  id: string;
  name: string;
  content: string;
  lessonType: string;
  videoUrl: string;
  imageUrl: string;
  fullTime: number;
  positionOrder: number;
  sessionId: string;
  courseId: string;
  userAvatar: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
export interface CourseSession {
  id: string;
  courseId: string;
  name: string;
  userId: string;
  slug: string;
  content: string;
  lessonList: CourseLesson[];
}
export interface CourseDetailResponse {
  id: string;
  name: string;
  userId: string;
  categoryId: string;
  content: string;
  status: CourseStatus;
  targetAudience: CourseTargetAudience;
  imageUrls: string[];
  videoUrls: string[];
  price: number;
  discount: number;
  slug: string;
  createdAt: string;
  isInCart: boolean;
  isPurchased: boolean;
  sessionList: CourseSession[];
  riskLevel: RiskLevel;
}
