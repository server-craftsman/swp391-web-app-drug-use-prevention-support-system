import { useMutation } from "@tanstack/react-query";
import { ReviewService } from "../services/review/review.service";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../types/review/Review.req.type";
import { helpers } from "../utils";

/**
 * Hook for createReview
 */
export const useCreateReview = () => {
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => ReviewService.createReview(data),
    onSuccess: () => {
      helpers.notificationMessage("Đánh giá thành công", "success");
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
/**
 * Hook for UpdateReview
 */
export const useUpdateReview = () => {
  return useMutation({
    mutationFn: (data: UpdateReviewRequest) => ReviewService.updateReview(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhật thành công", "success");
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
