import { useState, useEffect } from "react";
import BlogCard from "./BlogCard.com";
import blogData from "../../../data/blog.json";
import type { Blog } from "../../../types/blog/BlogModel";

const typedBlogData = blogData as Blog[];

export default function BlogList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(typedBlogData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = typedBlogData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Cuộn về đầu khi chuyển trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <>
      <div className="flex flex-col items-center">
        {paginatedBlogs.map((blog) => (
          <BlogCard blog={blog} key={blog.id} />
        ))}
      </div>

      {/* Thanh phân trang */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-900 text-white" : "bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </>
  );
}
