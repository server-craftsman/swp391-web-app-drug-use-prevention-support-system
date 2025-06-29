export interface Lesson {
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
}
export interface LessonPageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface LessonListResponse {
  pageData: Lesson[];
  pageInfo: LessonPageInfo;
}
