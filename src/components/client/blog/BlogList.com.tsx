import { useState, useEffect } from "react";
import BlogCard from "./BlogCard.com";
import type { Blog } from "../../../types/blog/Blog.res.type";
import PaginationComponent from "../../common/pagination.com";
import { DOMAIN_API } from "../../../consts/domain.const";

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    fetch(
      `${DOMAIN_API}blog?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
        setTotalPages(
          Math.max(
            1,
            data.totalPages || Math.ceil((data.total || 0) / itemsPerPage)
          )
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ✅ Bọc logic chuyển trang để không vượt quá giới hạn
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          blogs.map((blog) => <BlogCard blog={blog} key={blog.id} />)
        )}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
