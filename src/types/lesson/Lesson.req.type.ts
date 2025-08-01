export interface LessonRequest {
  pageNumber: number;
  pageSize: number;
  filterByName?: string;
}
export interface CreateLessonRequest {
  name: string;
  content: string;
  lessonType: string;
  videoUrl: string;
  imageUrl: string;
  fullTime: number;
  positionOrder: number;
  sessionId: string;
  courseId: string;
}
export interface UpdateLessonRequest {
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
}
export interface DeleteLessonRequest {
  id: string;
}
export interface GetLessonBySessionIdRequest {
  SessionId: string;
}
export interface GetLessonByIdRequest {
  lessonId: string;
}
