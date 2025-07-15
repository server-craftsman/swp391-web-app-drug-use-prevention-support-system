import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../services/category/category.service";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category/Category.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for createCategory
 */
export const useCreateCategory = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      CategoryService.createCategory(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo Category thành công", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_CATEGORY);
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
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      CategoryService.updateCategory(data),
    onSuccess: () => {
      helpers.notificationMessage("Category updated successfully", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_CATEGORY);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
