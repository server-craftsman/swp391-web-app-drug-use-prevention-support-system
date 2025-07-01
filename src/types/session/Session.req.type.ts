export interface SessionRequest {
  PageNumber: number;
  PageSize: number;
  FilterByName?: string;
}
export interface CreateSessionRequest {
  courseId: string;
  name: string;
  userId: string;
  slug: string;
  content: string;
  positionOrder: string;
}
export interface UpdateSessionRequest {
  id: string;
  name: string;
  slug: string;
  content: string;
  positionOrder: string;
  courseId: string;
}
export interface DeleteSessionRequest {
  id: string;
}
export interface GetSessionByCourseIdRequest {
  CourseId: string;
}
