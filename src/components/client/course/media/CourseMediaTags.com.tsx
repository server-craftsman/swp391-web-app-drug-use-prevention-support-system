import React from "react";
import { Tag } from "antd";

const CourseMediaTags: React.FC = () => {
  const tags = ["M&A", "Đầu tư", "Tài chính", "Kinh doanh"];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, index) => (
        <Tag
          key={index}
          className="border-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 cursor-pointer font-medium"
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};

export default CourseMediaTags; 