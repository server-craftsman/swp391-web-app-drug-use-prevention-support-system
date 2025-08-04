import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/user/user.service";
import type {
  GetUserByIdRequest,
  CreateUserRequest,
} from "../types/user/User.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for use getUserById
 */
export const useGetUserById = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: GetUserByIdRequest) => UserService.getUserById(data),
    onSuccess: () => {
      helpers.notificationMessage(
        "Lấy thông tin người dùng thành công",
        "success"
      );
      navigate(ROUTER_URL.ADMIN.USERS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for use createUser
 */
export const useCreateUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.createUser(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo người dùng thành công", "success");
      navigate(ROUTER_URL.ADMIN.USERS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
