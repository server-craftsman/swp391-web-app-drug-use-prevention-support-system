import { useMutation } from "@tanstack/react-query";
import { ReviewService } from "../services/review/review.service";
import type { CreateReviewRequest } from "../types/review/Review.req.type";
import { helpers } from "../utils";

/**
 * Hook for createReview
 */
export const useCreateReview = () => {
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => ReviewService.createReview(data),
    onSuccess: () => {
      helpers.notificationMessage("Create review successfully", "success");
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
