import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
import { LessonService } from "../services/lesson/lesson.service";
import type {
  CreateLessonRequest,
  UpdateLessonRequest,
} from "../types/lesson/Lesson.req.type";
import { useAuth } from "../contexts/Auth.context";
import { UserRole } from "../app/enums";
/**
 * Hook for createLesson
 */
export const useCreateLesson = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (data: CreateLessonRequest) => LessonService.createLesson(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo bài học thành công", "success");
      // Check role and navigate to appropriate route
      if (userInfo?.role === UserRole.ADMIN) {
        navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
      } else if (userInfo?.role === UserRole.MANAGER) {
        navigate(ROUTER_URL.MANAGER.COURSES);
      }
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for updateLesson
 */
export const useUpdateLesson = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (data: UpdateLessonRequest) => LessonService.updateLesson(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhập bài học thành công", "success");
      // Check role and navigate to appropriate route
      if (userInfo?.role === UserRole.ADMIN) {
        navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
      } else if (userInfo?.role === UserRole.MANAGER) {
        navigate(ROUTER_URL.MANAGER.COURSES);
      }
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
