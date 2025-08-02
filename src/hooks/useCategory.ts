import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../services/category/category.service";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category/Category.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
import { useAuth } from "../contexts/Auth.context";
import { UserRole } from "../app/enums";

/**
 * Hook for createCategory
 */
export const useCreateCategory = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      CategoryService.createCategory(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo Category thành công", "success");
      // Check role and navigate to appropriate route
      if (userInfo?.role === UserRole.ADMIN) {
        navigate(ROUTER_URL.ADMIN.MANAGER_CATEGORY);
      } else if (userInfo?.role === UserRole.MANAGER) {
        navigate(ROUTER_URL.MANAGER.CATEGORIES);
      }
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for updateCategory
 */
export const useUpdateCategory = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      CategoryService.updateCategory(data),
    onSuccess: () => {
      helpers.notificationMessage("Category updated successfully", "success");
      // Check role and navigate to appropriate route
      if (userInfo?.role === UserRole.ADMIN) {
        navigate(ROUTER_URL.ADMIN.MANAGER_CATEGORY);
      } else if (userInfo?.role === UserRole.MANAGER) {
        navigate(ROUTER_URL.MANAGER.CATEGORIES);
      }
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
