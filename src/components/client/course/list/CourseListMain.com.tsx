import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CourseService } from "../../../../services/course/course.service";
import type { Course } from "../../../../types/course/Course.res.type";
import type { CourseRequest } from "../../../../types/course/Course.req.type";
import CourseListHero from "./CourseListHero.com.tsx";
import CourseListFilters from "./CourseListFilters.com.tsx";
import CourseListGrid from "./CourseListGrid.com.tsx";
import { CourseStatus } from "../../../../app/enums/courseStatus.enum";

const itemsPerPage = 12;

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchCourses = async (page = 1, size = itemsPerPage) => {
    setLoading(true);
    const params: CourseRequest = {
      pageNumber: page,
      pageSize: size,
      filterByName: searchTerm,
    };
    if (selectedCategory) {
      (params as any).CategoryId = selectedCategory;
    }
    if (priceSort) {
      (params as any).SortByPrice = priceSort;
    }
    if (targetAudience) {
      (params as any).TargetAudience = targetAudience;
    }
    try {
      const res = await CourseService.getAllCourses(params);
      const data = res.data as any;
      // Lọc chỉ lấy course có status là "published"
      const publishedCourses = Array.isArray(data?.data)
        ? data.data.filter(
            (course: any) => course.status === CourseStatus.PUBLISHED
          )
        : [];
      setCourses(publishedCourses);
      setTotal(data?.totalCount || 0); // Giữ nguyên tổng để phân trang BE nếu cần
    } catch (err) {
      setCourses([]);
      setTotal(0);
      console.error("Lỗi khi lấy danh sách khóa học:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCourses(current, pageSize);
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line
  }, [
    current,
    pageSize,
    selectedCategory,
    priceSort,
    targetAudience,
    searchTerm,
  ]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleApplyFilters = (filters: {
    category: string;
    targetAudience: string;
    priceSort: string;
    searchTerm: string;
  }) => {
    setSelectedCategory(filters.category);
    setTargetAudience(filters.targetAudience);
    setPriceSort(filters.priceSort);
    setSearchTerm(filters.searchTerm);
    setCurrent(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setTargetAudience("all");
    setPriceSort("default");
    setSearchTerm("");
    setCurrent(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <CourseListHero
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="max-w-7xl mx-auto px-8">
        {/* Filters */}
        <CourseListFilters
          selectedCategory={selectedCategory}
          targetAudience={targetAudience}
          priceSort={priceSort}
          searchTerm={searchTerm}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Course Grid */}
        <CourseListGrid
          courses={courses}
          loading={loading}
          total={total}
          current={current}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </motion.div>
  );
};

export default CourseList;
