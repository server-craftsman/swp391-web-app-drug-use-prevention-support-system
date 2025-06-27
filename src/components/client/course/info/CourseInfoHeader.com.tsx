import React from "react";
import { Typography, Tag } from "antd";
import { CalendarOutlined, UserOutlined, CrownOutlined, StarFilled } from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";

const { Title, Text } = Typography;

interface CourseInfoHeaderProps {
  course: Course;
}

const statusColor: Record<string, string> = {
  PUBLISHED: "green",
  ARCHIVED: "orange", 
  DRAFT: "blue",
  published: "green",
  archived: "orange",
  draft: "blue",
};

const statusLabel: Record<string, string> = {
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Đã lưu trữ",
  DRAFT: "Bản nháp",
  published: "Đã xuất bản", 
  archived: "Đã lưu trữ",
  draft: "Bản nháp",
};

const targetAudienceMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  COMMUNITY: { label: "Cộng đồng", icon: <UserOutlined />, color: "purple" },
  TEACHER: { label: "Giáo viên", icon: <CrownOutlined />, color: "gold" },
  PARENT: { label: "Phụ huynh", icon: <UserOutlined />, color: "green" },
  STUDENT: { label: "Học sinh", icon: <UserOutlined />, color: "blue" },
  YOUTH: { label: "Thanh thiếu niên", icon: <UserOutlined />, color: "cyan" },
  community: { label: "Cộng đồng", icon: <UserOutlined />, color: "purple" },
  teacher: { label: "Giáo viên", icon: <CrownOutlined />, color: "gold" },
  parent: { label: "Phụ huynh", icon: <UserOutlined />, color: "green" },
  student: { label: "Học sinh", icon: <UserOutlined />, color: "blue" },
  youth: { label: "Thanh thiếu niên", icon: <UserOutlined />, color: "cyan" },
};

const CourseInfoHeader: React.FC<CourseInfoHeaderProps> = ({ course }) => {
  const status = (course.status || "draft").toLowerCase();
  const targetAudienceKey = course.targetAudience?.toLowerCase() || "student";
  const targetAudience = targetAudienceMap[targetAudienceKey] || {
    label: course.targetAudience || "Không xác định",
    icon: <UserOutlined />,
    color: "default"
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <Title level={1} className="text-white mb-4 text-3xl font-bold">
            {course.name || "Không có tên khóa học"}
          </Title>
          
          <div className="flex items-center space-x-4 mb-4">
            <Tag 
              color={targetAudience.color}
              className="px-4 py-2 rounded-full text-sm font-medium flex items-center"
            >
              {targetAudience.icon}
              <span className="ml-2">{targetAudience.label}</span>
            </Tag>
            
            <Tag 
              color={statusColor[status]}
              className="px-4 py-2 rounded-full text-sm font-medium"
            >
              {statusLabel[status] || status}
            </Tag>
          </div>

          <div className="flex items-center text-white/80 text-sm">
            <CalendarOutlined className="mr-2" />
            Tạo ngày {formatDate(course.createdAt)}
          </div>
        </div>

        {/* Rating */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-1 text-yellow-300 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarFilled key={i} className="text-lg" />
            ))}
          </div>
          <Text className="text-white font-bold text-lg">4.8</Text>
          <div className="text-white/60 text-xs">124 đánh giá</div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoHeader; 