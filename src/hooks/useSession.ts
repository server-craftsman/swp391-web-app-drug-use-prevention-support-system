import { useMutation } from "@tanstack/react-query";
import { SessionService } from "../services/session/session.service";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "../types/session/Session.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for blog createSession
 */
export const useCreateSession = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) =>
      SessionService.createSession(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo buổi học thành công", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
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

  return useMutation({
    mutationFn: (data: UpdateSessionRequest) =>
      SessionService.updateSession(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhập buổi học thành công", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
