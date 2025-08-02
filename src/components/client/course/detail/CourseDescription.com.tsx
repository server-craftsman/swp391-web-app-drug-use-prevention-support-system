import React, { useState } from "react";
import { Typography, Card, Button } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

const { Title, Paragraph } = Typography;

interface CourseDescriptionProps {
  course: Course;
}

const WORD_LIMIT = 60;

function getWordsFromHTML(html: string) {
  // Loại bỏ tag HTML và lấy text
  const text = html.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean);
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ course }) => {
  const [expanded, setExpanded] = useState(false);

  const getTargetAudienceLabel = (audience: string) => {
    const map: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      parent: "Phụ huynh",
    };
    return map[audience] || audience;
  };

  // Xử lý giới hạn từ
  const words = getWordsFromHTML(course.content || "");
  const isLong = words.length > WORD_LIMIT;

  // Lấy HTML rút gọn (nếu cần)
  let shortHTML = course.content;
  if (isLong && !expanded) {
    const shortText = words.slice(0, WORD_LIMIT).join(" ") + "...";
    shortHTML = `<span>${shortText}</span>`;
  }

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <Title level={3} className="text-gray-900 mb-6">
        Mô tả
      </Title>
      <Paragraph className="text-gray-700 text-base leading-relaxed">
        <span
          dangerouslySetInnerHTML={{
            __html: expanded || !isLong ? course.content : shortHTML,
          }}
        />
        {isLong && (
          <Button
            type="link"
            onClick={() => setExpanded((prev) => !prev)}
            style={{ paddingLeft: 8, fontWeight: 500 }}
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </Button>
        )}
      </Paragraph>
      <Paragraph className="text-gray-700 text-base leading-relaxed">
        Khóa học này được thiết kế đặc biệt cho{" "}
        {getTargetAudienceLabel(course.targetAudience).toLowerCase()}
        với nội dung phù hợp và phương pháp giảng dạy hiện đại. Bạn sẽ được học
        từ những chuyên gia hàng đầu trong lĩnh vực này.
      </Paragraph>
    </Card>
  );
};

export default CourseDescription;
