export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
export interface ReviewPageInfo {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}
