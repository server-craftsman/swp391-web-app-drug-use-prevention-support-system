import { useMutation } from "@tanstack/react-query";
import { CourseService } from "../services/course/course.service";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../types/course/Course.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for use createCourse
 */
export const useCreateCourse = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => CourseService.createCourse(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo Khóa học thành công", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
export const useUpdateCourse = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) => CourseService.updateCourse(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhập Khóa học thành công", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
