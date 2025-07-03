import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Spin,
  Divider,
  Image,
  Tag,
  Avatar,
  message,
} from "antd";
import { LessonService } from "../../../../services/lesson/lesson.service";
import type { Lesson } from "../../../../types/lesson/Lesson.res.type";
import type { Course } from "../../../../types/course/Course.res.type";
import type { Session } from "../../../../types/session/Session.res.type";
import { formatDate } from "../../../../utils/helper";

const { Title, Text, Paragraph } = Typography;

interface ViewLessonProps {
  lessonId: string | null;
  open: boolean;
  onClose: () => void;
  courses: Course[];
  sessions: Session[];
}

const ViewLesson: React.FC<ViewLessonProps> = ({
  lessonId,
  open,
  onClose,
  courses,
  sessions,
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lessonId && open) {
      fetchLesson(lessonId);
    }
  }, [lessonId, open]);

  const fetchLesson = async (id: string) => {
    setLoading(true);
    try {
      const res = await LessonService.getLessonById({ lessonId: id });
      setLesson(res.data?.data || null);
    } catch {
      message.error("Không thể tải thông tin bài học.");
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = () => {
    if (!lesson || !lesson.courseId) return "Không xác định";
    const found = courses.find((c) => c.id === lesson.courseId);
    return found?.name || "Không xác định";
  };

  const getSessionName = () => {
    if (!lesson || !lesson.sessionId) return "Không xác định";
    const found = sessions.find((s) => s.id === lesson.sessionId);
    return found?.name || "Không xác định";
  };

  const renderLessonContent = () => {
    if (!lesson) return null;
    switch (lesson.lessonType.toLowerCase()) {
      case "video":
        return lesson.videoUrl ? (
          <video controls width="100%" src={lesson.videoUrl} />
        ) : (
          <Text type="secondary">Không có video.</Text>
        );
      case "image":
        return lesson.imageUrl ? (
          <Image src={lesson.imageUrl} width={400} />
        ) : (
          <Text type="secondary">Không có hình ảnh.</Text>
        );
      default:
        return (
          <Paragraph className="whitespace-pre-line">
            {lesson.content || "Không có nội dung."}
          </Paragraph>
        );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      title={
        <Title level={4} className="!mb-0 text-blue-700">
          📘 Chi tiết bài học
        </Title>
      }
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : lesson ? (
        <div className="space-y-5 text-[15px] leading-relaxed text-gray-800">
          <div className="bg-gray-50 p-4 rounded-md border">
            <Text className="block font-semibold text-gray-500 mb-1">
              Tên bài học:
            </Text>
            <Text className="text-lg font-semibold text-blue-700">
              {lesson.name}
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Text className="block font-semibold text-gray-500">
                Khóa học:
              </Text>
              <Text>{getCourseName()}</Text>
            </div>
            <div>
              <Text className="block font-semibold text-gray-500">
                Phiên học:
              </Text>
              <Text>{getSessionName()}</Text>
            </div>
            <div>
              <Text className="block font-semibold text-gray-500">Vị trí:</Text>
              <Text>{lesson.positionOrder ?? "N/A"}</Text>
            </div>
            <div>
              <Text className="block font-semibold text-gray-500">
                Loại bài học:
              </Text>
              <Tag color="blue">{lesson.lessonType.toUpperCase()}</Tag>
            </div>
          </div>

          <Divider />

          <div>
            <Text className="block font-semibold text-gray-500 mb-1">
              Nội dung / Media:
            </Text>
            {renderLessonContent()}
          </div>

          <Divider />

          <div className="flex items-center gap-3">
            <Avatar src={lesson.userAvatar} />
            <div>
              <Text className="block font-semibold text-gray-500">
                Người tạo:
              </Text>
              <Text>{lesson.fullName}</Text>
            </div>
          </div>

          <div>
            <Text className="block font-semibold text-gray-500">Ngày tạo:</Text>
            <Text>{formatDate(new Date(lesson.createdAt))}</Text>
          </div>
        </div>
      ) : (
        <Text>Không tìm thấy dữ liệu bài học.</Text>
      )}
    </Modal>
  );
};

export default ViewLesson;
