import { useEffect, useState } from "react";
import { CourseService } from "../../../services/course/course.service";
import type { Course } from "../../../types/course/Course.res.type";
import type { CourseRequest } from "../../../types/course/Course.req.type";
import CustomPagination from "../../common/Pagiation.com";
import CourseCard from "./CourseCard.com";
import DropdownComponent from "../../common/dropdown.com";
import { Spin, Empty } from "antd";

const itemsPerPage = 12;

const categoryItems = [
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

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("");

  const fetchCourses = async (page = 1, size = itemsPerPage) => {
    setLoading(true);
    const params: CourseRequest = {
      PageNumber: page,
      PageSize: size,
      FilterByName: "",
    };
    if (selectedCategory) {
      (params as any).CategoryId = selectedCategory;
    }
    if (priceSort) {
      (params as any).SortByPrice = priceSort;
    }
    try {
      const res = await CourseService.getAllCourses(params);
      // Map dữ liệu từ API về đúng interface chuẩn
      const data = res.data as any;
      setCourses(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setCourses([]);
      setTotal(0);
      console.error("Lỗi khi lấy danh sách khóa học:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(current, pageSize);
    // eslint-disable-next-line
  }, [current, pageSize, selectedCategory, priceSort]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrent(1);
  };

  const handlePriceSortChange = (value: string) => {
    setPriceSort(value);
    setCurrent(1);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <DropdownComponent
          items={categoryItems}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Chọn danh mục"
        />
        <DropdownComponent
          items={priceSortItems}
          value={priceSort}
          onChange={handlePriceSortChange}
          placeholder="Sắp xếp giá"
        />
      </div>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="text-center py-8 text-lg">
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <Empty description="Không có khóa học nào" />
        ) : (
          <div className="flex flex-wrap -mx-2 w-full">
            {courses.map((course) => (
              <div
                key={course.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
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

export default CourseList;
