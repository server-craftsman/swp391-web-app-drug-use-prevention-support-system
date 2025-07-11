import React from "react";
import { Typography, Card, Button, Collapse } from "antd";
import { DownOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../../consts/router.path.const";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Lecture {
  id: string;
  title: string;
  duration?: string;
  preview?: boolean;
  completed?: boolean;
  imageUrl?: string;
}

interface CourseSection {
  title: string;
  duration?: string;
  lessons: number;
  expanded?: boolean;
  lectures: Lecture[];
}

interface CourseContentProps {
  content: CourseSection[];
}

const CourseContent: React.FC<CourseContentProps> = ({ content }) => {
  const navigate = useNavigate();

  const totalLessons = content.reduce(
    (acc, section) => acc + section.lessons,
    0
  );

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <Title level={3} className="text-gray-900 mb-0">
          Nội dung khóa học
        </Title>
        <div className="text-gray-600 text-sm">
          <Text className="mr-4">
            • {content.length} phần • {totalLessons} bài giảng
          </Text>
        </div>
      </div>

      <Collapse
        ghost
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} className="text-gray-500" />
        )}
      >
        {content.map((section, index) => (
          <Panel
            key={index}
            header={
              <div className="flex items-center justify-between w-full pr-4">
                <Text className="font-semibold text-gray-900">
                  {section.title}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {section.lessons} bài • {section.duration}
                </Text>
              </div>
            }
            className="border-b border-gray-200 last:border-b-0"
          >
            {section.lectures && section.lectures.length > 0 ? (
              <div className="space-y-1 pb-4">
                {section.lectures.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.id || lectureIndex}
                    className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    onClick={() =>
                      lecture.id &&
                      navigate(
                        ROUTER_URL.CUSTOMER.LESSON_DETAIL.replace(
                          ":lessonId",
                          lecture.id
                        )
                      )
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <PlayCircleOutlined className="text-gray-500 text-sm" />
                      <Text className="text-gray-700 text-sm">
                        {lecture.title}
                      </Text>
                      {lecture.preview && (
                        <Button
                          type="link"
                          size="small"
                          className="text-purple-600 p-0 h-auto text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Xử lý xem trước nếu cần
                          }}
                        >
                          Xem trước
                        </Button>
                      )}
                      {/* Hiển thị ảnh nếu có */}
                      {lecture.imageUrl && lecture.imageUrl !== "" && (
                        <img
                          src={lecture.imageUrl}
                          alt={lecture.title}
                          style={{
                            maxWidth: 80,
                            maxHeight: 80,
                            marginLeft: 8,
                            borderRadius: 6,
                            border: "1px solid #eee",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>
                    <Text className="text-gray-600 text-sm">
                      {lecture.duration}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-sm py-4 px-4">
                {section.lessons} bài giảng sẽ được cập nhật sớm
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default CourseContent;
