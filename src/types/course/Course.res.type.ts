import type { CourseStatus } from "../../app/enums/courseStatus.enum";
import type { Lesson } from "../lesson/Lesson.res.type";
import type { Session } from "../session/Session.res.type";

export interface Course {
  id: string;
  name: string;
  userId: string;
  categoryId: string;
  content: string;
  status: CourseStatus;
  targetAudience: string;
  imageUrls: string[];
  videoUrls: string[];
  price: number;
  discount: number;
  slug: string;
  createdAt: string;
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
export interface CourseDetailResponse {
  course: Course; // course detail
  sessionList: Session[];
  lessonList: Lesson[];
}
