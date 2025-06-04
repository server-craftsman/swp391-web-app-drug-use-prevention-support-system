import { useState, useEffect } from "react";
import BlogCard from "./BlogCard.com";
import blogData from "../../../data/blog.json";
import type { Blog } from "../../../types/blog/BlogModel";
import PaginationComponent from "../../common/pagination.com";
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

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
