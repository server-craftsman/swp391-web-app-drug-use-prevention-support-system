import { useMutation } from "@tanstack/react-query";
import { SessionService } from "../services/session/session.service";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "../types/session/Session.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
import { useAuth } from "../contexts/Auth.context";
import { UserRole } from "../app/enums";

/**
 * Hook for blog createSession
 */
export const useCreateSession = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) =>
      SessionService.createSession(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo buổi học thành công", "success");
      // Check role and navigate to appropriate route
      if (userInfo?.role === UserRole.ADMIN) {
        navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
      } else if (userInfo?.role === UserRole.MANAGER) {
        navigate(ROUTER_URL.MANAGER.COURSES);
      }
    },
    onError: (error) => {
      console.error("Lỗi tạo buổi học:", error);
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for blog updateSession
 */
export const useUpdateSession = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  return useMutation({
    mutationFn: (data: UpdateSessionRequest) =>
      SessionService.updateSession(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhập buổi học thành công", "success");
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
