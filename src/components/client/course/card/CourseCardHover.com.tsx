import React from "react";
import { Card, Typography, Button, Divider } from "antd";
import { motion } from "framer-motion";
import {
  ClockCircleOutlined,
  StarFilled,
  HeartOutlined,
  ShareAltOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";
import AddToCartButton from "../../../common/addToCartButton.com";

const { Paragraph, Text } = Typography;

interface CourseCardHoverProps {
  course: Course;
}

const CourseCardHover: React.FC<CourseCardHoverProps> = ({ course }) => {
  // Calculate final price after discount
  const finalPrice = course.price * (1 - course.discount / 100);

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Sample course highlights for demo
  const courseHighlights = [
    "12 giờ video theo yêu cầu",
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành",
  ];

  return (
    <motion.div
      className="w-80"
      initial={{ opacity: 0, scale: 0.9, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className="shadow-2xl border-0 overflow-hidden pointer-events-auto"
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Header Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.imageUrls?.[0] || "/no-image.png"}
            alt={course.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/no-image.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Text className="text-white font-bold text-lg block mb-2">
              {course.name}
            </Text>
            <div className="flex items-center text-white/80 text-sm">
              <ClockCircleOutlined className="mr-1" />
              Cập nhật {formatDate(course.createdAt)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <Paragraph
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            ellipsis={{ rows: 3 }}
          >
            {course.content}
          </Paragraph>

          {/* Course Highlights */}
          <div className="mb-4">
            <Text strong className="text-gray-800 block mb-2">
              Khóa học bao gồm:
            </Text>
            <ul className="space-y-1">
              {courseHighlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-600"
                >
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <Divider className="my-4" />

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <StarFilled className="text-yellow-400 mr-1" />
                <Text className="font-medium">4.8</Text>
                <Text className="text-gray-500 text-sm ml-1">(2,345)</Text>
              </div>
              <Text className="text-gray-500 text-sm">1,234 học viên</Text>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {course.isPurchased === true ? (
                <span className="flex items-center text-green-600 font-bold text-base">
                  <CheckCircleTwoTone twoToneColor="#52c41a" className="mr-2" />
                  Đã sở hữu
                </span>
              ) : (
                <div className="flex items-center space-x-2">
                  <Text className="text-2xl font-bold text-blue-600">
                    {formatCurrency(finalPrice)}
                  </Text>
                  {course.discount > 0 && (
                    <Text delete className="text-gray-400">
                      {formatCurrency(course.price)}
                    </Text>
                  )}
                  {course.discount > 0 && (
                    <Text className="text-red-500 text-sm font-medium">
                      -{course.discount}%
                    </Text>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {course.isPurchased === true ? (
              <Button
                type="primary"
                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                block
                disabled
                className="bg-green-500 border-0"
              >
                Đã sở hữu
              </Button>
            ) : (
              <AddToCartButton courseId={course.id} />
            )}

            <div className="flex space-x-2">
              <Button
                icon={<HeartOutlined />}
                className="flex-1 border-gray-300 hover:border-red-400 hover:text-red-500"
              >
                Yêu thích
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                className="flex-1 border-gray-300 hover:border-blue-400 hover:text-blue-500"
              >
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCardHover;
