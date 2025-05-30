import { useState } from "react";
import CourseCard from "./CourseCard.com";
import courseData from "../../../data/course.json";
import type { Course } from "../../../types/course/CourseModel";
import DropdownComponent from "../../common/dropdown.com";
import "antd/dist/reset.css";

const typedCourseData = courseData as Course[];

export default function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceSort, setPriceSort] = useState<string>("");

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

  return (
    <>
      <DropdownComponent
        items={items}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />
      <DropdownComponent
        items={priceSortItems}
        value={priceSort}
        onChange={setPriceSort}
        placeholder="Sắp xếp giá"
      />
      <div className="flex flex-wrap -mx-2">
        {sortedCourses.map((course) => (
          <div
            key={course.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </>
  );
}
