import { useMutation } from "@tanstack/react-query";
import { BlogService } from "../services/blog/blog.service";
import type { CreateBlogRequest } from "../types/blog/Blog.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for blog createBlog
 */
export const useCreateBlog = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateBlogRequest) => BlogService.createBlog(data),
    onSuccess: () => {
      helpers.notificationMessage("Blog created successfully", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_BLOG);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
