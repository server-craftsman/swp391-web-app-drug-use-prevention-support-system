// import { useMutation } from "@tanstack/react-query";
// import { BlogService } from "../services/blog/blog.service";
// import type {
//   CreateBlogRequest,
//   UpdateBlogRequest,
// } from "../types/blog/Blog.req.type";
// import { useNavigate } from "react-router-dom";
// import { ROUTER_URL } from "../consts/router.path.const";
// import { helpers } from "../utils";

// /**
//  * Hook for blog createBlog
//  */
// export const useCreateBlog = () => {
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: (data: CreateBlogRequest) => BlogService.createBlog(data),
//     onSuccess: () => {
//       helpers.notificationMessage("Blog created successfully", "success");
//       navigate(ROUTER_URL.ADMIN.MANAGER_BLOG);
//     },
//     onError: (error) => {
//       helpers.notificationMessage(error.message, "error");
//     },
//   });
// };

// /**
//  * Hook for blog updateBlog
//  */
// export const useUpdateBlog = () => {
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: (data: UpdateBlogRequest) => BlogService.updateBlog(data),
//     onSuccess: () => {
//       helpers.notificationMessage("Blog updated successfully", "success");
//       navigate(ROUTER_URL.ADMIN.MANAGER_BLOG);
//     },
//     onError: (error) => {
//       helpers.notificationMessage(error.message, "error");
//     },
//   });
// };
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
      helpers.notificationMessage("Session created successfully", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
    },
    onError: (error) => {
      console.error("Lỗi tạo khóa học:", error);
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
      helpers.notificationMessage("Session updated successfully", "success");
      navigate(ROUTER_URL.ADMIN.MANAGER_COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
