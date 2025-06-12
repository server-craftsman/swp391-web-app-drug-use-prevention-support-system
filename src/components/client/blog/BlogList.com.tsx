import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const params: BlogRequest = { pageNumber: 1, pageSize: 10 };
      try {
        const res = await BlogService.getAllBlogs(params);
        setBlogs(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      {loading
        ? "Đang tải..."
        : blogs.map((blog) => <div key={blog.id}>{blog.userId}</div>)}
    </div>
  );
};

export default BlogList;
