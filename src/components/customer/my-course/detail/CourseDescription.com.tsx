import React from "react";
import { Typography, Card } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

const { Title, Paragraph } = Typography;

interface CourseDescriptionProps {
  course: Course;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ course }) => {
  const getTargetAudienceLabel = (audience: string) => {
    const map: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      parent: "Phụ huynh",
    };
    return map[audience] || audience;
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <Title level={3} className="text-gray-900 mb-6">
        Mô tả
      </Title>
      <Paragraph className="text-gray-700 text-base leading-relaxed">
        {course.content}
      </Paragraph>
      <Paragraph className="text-gray-700 text-base leading-relaxed">
        Khóa học này được thiết kế đặc biệt cho{" "}
        {getTargetAudienceLabel(course.targetAudience).toLowerCase()} với nội
        dung phù hợp và phương pháp giảng dạy hiện đại. Bạn sẽ được học từ những
        chuyên gia hàng đầu trong lĩnh vực này.
      </Paragraph>
    </Card>
  );
};

export default CourseDescription;
