import React from "react";
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

interface MoreCoursesProps {
  instructorName?: string;
}

const MoreCourses: React.FC<MoreCoursesProps> = ({ instructorName = "Huy Nguyen" }) => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <Title level={3} className="text-gray-900 mb-4">
        Các khóa học khác của <span className="text-blue-600">{instructorName}</span>
      </Title>
      <Text className="text-gray-600">
        Khám phá thêm những khóa học chất lượng cao từ giảng viên này...
      </Text>
    </Card>
  );
};

export default MoreCourses; 