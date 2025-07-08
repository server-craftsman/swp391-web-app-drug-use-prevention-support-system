import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  BlogRequest,
  CreateBlogRequest,
  DeleteBlogRequest,
  UpdateBlogRequest,
  GetBlogByIdRequest,
} from "../../types/blog/Blog.req.type";
import type { Blog } from "../../types/blog/Blog.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const BlogService = {
  getAllBlogs(params: BlogRequest) {
    return BaseService.get<ResponseSuccess<Blog[]>>({
      url: API_PATH.BLOG.GET_ALL_BLOGS,
      payload: params,
    });
  },
  createBlog(params: CreateBlogRequest) {
    return BaseService.post<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.CREATE_BLOG,
      payload: params,
    });
  },
  deleteBlog(params: DeleteBlogRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.BLOG.DELETE_BLOG(params.id),
      payload: params,
    });
  },
  updateBlog(params: UpdateBlogRequest) {
    return BaseService.put<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.UPDATE_BLOG(params.id), // Assuming the same endpoint for update
      payload: params,
    });
  },
  getBlogById(params: GetBlogByIdRequest) {
    return BaseService.get<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.GET_BLOG_BY_ID(params.id),
      payload: params,
    });
  },
};
