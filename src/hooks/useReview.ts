import { useMutation, useQuery } from "@tanstack/react-query";
import { ReviewService } from "../services/review/review.service";
import type { CreateReviewRequest } from "../types/review/Review.req.type";
import type { Review } from "../types/review/Review.res.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for createReview
 */
export const useCreateReview = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => ReviewService.createReview(data),
    onSuccess: () => {
      helpers.notificationMessage("Đánh giá thành công", "success");
      navigate(ROUTER_URL.CLIENT.COURSE_DETAIL);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for get reviews by courseId
 */
export const useCourseReviews = (courseId?: string) => {
  return useQuery({
    queryKey: ["reviews", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const res = await ReviewService.getAllReviews({});
      return (res.data?.data || []).filter(
        (r: Review) => r.courseId === courseId
      );
    },
    enabled: !!courseId,
  });
};
