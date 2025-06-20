import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { Blog } from "../../../types/blog/Blog.res.type";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import CustomPagination from "../../common/Pagiation.com";
import BlogCard from "./BlogCard.com"; // Thêm dòng này

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async (page = 1, size = 6) => {
    setLoading(true);
    const params: BlogRequest = { pageNumber: page, pageSize: size };
    try {
      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      setBlogs(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setBlogs([]);
      console.error("Lỗi khi lấy blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(current, pageSize);
  }, [current, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="text-center py-8 text-lg">Đang tải...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có blog nào.
          </div>
        ) : (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>
      <div className="flex justify-center mt-6">
        <CustomPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BlogList;
