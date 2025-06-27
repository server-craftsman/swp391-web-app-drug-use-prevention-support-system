import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/user/user.service";
import type { GetUserByIdRequest } from "../types/user/User.req.type";
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
        "User details fetched successfully",
        "success"
      );
      navigate(ROUTER_URL.ADMIN.USERS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
