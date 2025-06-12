import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  BlogRequest,
  CreateBlogRequest,
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
};
