import React from "react";
import { Typography, Tag } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";

const { Text } = Typography;

interface CourseInfoPriceProps {
  course: Course;
}

const CourseInfoPrice: React.FC<CourseInfoPriceProps> = ({ course }) => {
  const price = typeof course.price === "number" ? course.price : 0;
  const discount = typeof course.discount === "number" ? course.discount : 0;
  const finalPrice = price - discount;
  const discountPercentage = discount > 0 ? Math.round((discount / price) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-6">
      <div className="text-center">
        <Text className="text-gray-600 text-lg font-medium block mb-2">Giá khóa học</Text>
        
        {discount > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <Text
                delete
                className="text-gray-400 text-xl"
              >
                {formatCurrency(price)}
              </Text>
              <Tag color="red" className="text-lg font-bold px-3 py-1">
                -{discountPercentage}%
              </Tag>
            </div>
            <Text className="text-4xl font-bold text-red-500 block">
              {formatCurrency(finalPrice)}
            </Text>
            <Text className="text-green-600 text-sm font-medium">
              Tiết kiệm {formatCurrency(discount)}
            </Text>
          </div>
        ) : (
          <Text className="text-4xl font-bold text-blue-600 block">
            {formatCurrency(price)}
          </Text>
        )}
      </div>
    </div>
  );
};

export default CourseInfoPrice; 