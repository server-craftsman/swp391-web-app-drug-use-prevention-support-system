import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  CreateReviewRequest,
  DeleteReviewRequest,
  GetAllReviewRequest,
  GetReviewByCourseIdRequest,
  GetReviewByUserIdRequest,
} from "../../types/review/Review.req.type";
import type { Review } from "../../types/review/Review.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const ReviewService = {
  getAllReviews(params: GetAllReviewRequest) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_ALL_REVIEWS,
      payload: params,
    });
  },
  createReview(params: CreateReviewRequest) {
    return BaseService.post<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.CREATE_REVIEW,
      payload: params,
    });
  },
  deleteReview(params: DeleteReviewRequest) {
    return BaseService.remove<ResponseSuccess<Review>>({
      url: API_PATH.REVIEW.DELETE_REVIEW(params.id),
      payload: params,
    });
  },
  getReviewByCourseId(params: GetReviewByCourseIdRequest) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_REVIEW_BY_COURSE_ID(params.courseId),
      payload: params,
    });
  },
  getReviewByUserId(params: GetReviewByUserIdRequest) {
    return BaseService.get<ResponseSuccess<Review[]>>({
      url: API_PATH.REVIEW.GET_REVIEW_BY_USER_ID(params.userId),
      payload: params,
    });
  },
};
