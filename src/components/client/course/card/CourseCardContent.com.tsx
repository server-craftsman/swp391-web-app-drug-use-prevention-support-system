import React from "react";
import { Typography, Tag } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  StarFilled,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";

const { Paragraph } = Typography;

interface CourseCardContentProps {
  course: Course;
}

const CourseCardContent: React.FC<CourseCardContentProps> = ({ course }) => {
  // Calculate final price after discount
  const finalPrice = course.price * (1 - course.discount / 100);

  // Map target audience to Vietnamese
  const getTargetAudienceLabel = (audience: string) => {
    const map: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      parent: "Phụ huynh",
    };
    return map[audience] || audience;
  };

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 h-64 flex flex-col justify-between bg-white">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Tag
            color="blue"
            className="text-xs font-medium px-3 py-1 rounded-full"
          >
            <UserOutlined className="mr-1" />
            {getTargetAudienceLabel(course.targetAudience)}
          </Tag>
          <div className="flex items-center text-gray-500 text-xs">
            <ClockCircleOutlined className="mr-1" />
            {formatDate(course.createdAt)}
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3 text-gray-800 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {course.name}
        </h3>

        <Paragraph className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {course.content}
        </Paragraph>
      </div>

      {/* Footer with pricing */}
      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {course.isPurchased === true ? (
              <span className="flex items-center text-green-600 font-bold text-base">
                <CheckCircleTwoTone twoToneColor="#52c41a" className="mr-2" />
                Đã sở hữu
              </span>
            ) : course.discount > 0 ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(course.price)}
                </span>
                <span className="text-xl font-bold text-red-500">
                  {formatCurrency(finalPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(course.price)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <StarFilled key={i} className="text-xs" />
            ))}
            <span className="text-gray-500 text-sm ml-2">4.8</span>
          </div>
        </div>

        <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </div>
  );
};

export default CourseCardContent;
