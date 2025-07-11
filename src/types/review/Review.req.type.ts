export interface GetAllReviewRequest {
  pageSize: number;
  pageNumber: number;
  filterByCourseId?: string;
}
export interface GetReviewByCourseIdRequest {
  courseId: string;
}
export interface GetReviewByUserIdRequest {
  userId: string;
}
export interface CreateReviewRequest {
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
}
export interface DeleteReviewRequest {
  id: string;
}
export interface GetReviewById {
  id: string;
}
