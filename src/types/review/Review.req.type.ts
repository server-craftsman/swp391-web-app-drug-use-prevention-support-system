export interface GetAllReviewRequest {
  filterByCourseId?: string;
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
export interface GetReviewByIdRequest {
  id: string;
}
