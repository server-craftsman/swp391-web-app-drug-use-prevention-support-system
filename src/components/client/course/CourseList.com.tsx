import { useState, useEffect } from "react";
import CourseCard from "./CourseCard.com";
import courseData from "../../../data/course.json";
import type { Course } from "../../../types/course/CourseModel";
import DropdownComponent from "../../common/dropdown.com";
import "antd/dist/reset.css";
import PaginationComponent from "../../common/pagination.com";
const typedCourseData = courseData as Course[];

export default function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const items = [
    { label: "Tất cả", key: "" },
    { label: "Phòng Chống", key: "1" },
    { label: "Kỹ Năng", key: "2" },
    { label: "Dấu Hiệu", key: "3" },
    { label: "Tác Hại", key: "4" },
    { label: "Tâm lý", key: "5" },
    { type: "divider" as const },
  ];

  const priceSortItems = [
    { label: "Mặc định", key: "" },
    { label: "Giá tăng dần", key: "asc" },
    { label: "Giá giảm dần", key: "desc" },
  ];

  // Filter theo category
  const filteredCourses =
    selectedCategory === ""
      ? typedCourseData
      : typedCourseData.filter(
          (course) => course.categoryId === Number(selectedCategory)
        );

  // Sort theo giá
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (priceSort === "asc") return a.price - b.price;
    if (priceSort === "desc") return b.price - a.price;
    return 0;
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = sortedCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset về trang 1 khi thay đổi bộ lọc
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePriceSortChange = (value: string) => {
    setPriceSort(value);
    setCurrentPage(1);
  };

  // 👉 Cuộn về đầu trang khi currentPage thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  return (
    <>
      <div className="flex gap-4 mb-4">
        <DropdownComponent
          items={items}
          value={selectedCategory}
          onChange={handleCategoryChange}
        />
        <DropdownComponent
          items={priceSortItems}
          value={priceSort}
          onChange={handlePriceSortChange}
          placeholder="Sắp xếp giá"
        />
      </div>

      <div className="flex flex-wrap -mx-2">
        {paginatedCourses.map((course) => (
          <div
            key={course.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
          >
            <CourseCard course={course} />
          </div>
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
