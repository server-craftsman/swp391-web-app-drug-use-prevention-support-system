import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import { Card } from "antd";

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const params: BlogRequest = { pageNumber: 1, pageSize: 10 };
      try {
        const res = await BlogService.getAllBlogs(params);
        // Log dữ liệu trả về để debug
        console.log("API response:", res.data);
        const data = res.data as any;
        // Sửa tại đây: data.data là mảng blog
        setBlogs(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setBlogs([]);
        console.error("Lỗi khi lấy blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {loading ? (
        <div className="col-span-2 text-center py-8 text-lg">Đang tải...</div>
      ) : blogs.length === 0 ? (
        <div className="col-span-2 text-center py-8 text-gray-500">
          Không có blog nào.
        </div>
      ) : (
        blogs.map((blog) => (
          <Card
            key={blog.id}
            title={`Người đăng: ${blog.userId}`}
            className="mb-4"
          >
            <img
              src={blog.blogImgUrl}
              alt="Blog"
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div>{blog.content}</div>
            <div className="text-xs text-gray-500 mt-2">
              Ngày tạo: {new Date(blog.createdAt).toLocaleString()}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default BlogList;
