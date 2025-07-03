import React, { useEffect, useState } from "react";
import { Modal, Typography, Spin, Divider, message } from "antd";
import type { Session } from "../../../../types/session/Session.res.type";
import type { Course } from "../../../../types/course/Course.res.type";
import { SessionService } from "../../../../services/session/session.service";

const { Title, Text, Paragraph } = Typography;

interface ViewSessionProps {
  sessionId: string | null;
  open: boolean;
  onClose: () => void;
  courses: Course[];
}

const ViewSession: React.FC<ViewSessionProps> = ({
  sessionId,
  open,
  onClose,
  courses,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId && open) {
      fetchSession(sessionId);
    }
  }, [sessionId, open]);

  const fetchSession = async (id: string) => {
    setLoading(true);
    try {
      const res = await SessionService.getSessionById({ id });
      setSession(res.data?.data || null);
    } catch (err) {
      message.error("Không thể tải thông tin buổi học.");
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.name || "Không xác định";
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      centered
      title={
        <Title level={4} className="!mb-0 text-blue-700">
          📘 Chi tiết buổi học
        </Title>
      }
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : session ? (
        <div className="space-y-5 text-[15px] leading-relaxed text-gray-800">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <Text className="block font-semibold text-gray-500 mb-1">
              Tên buổi học:
            </Text>
            <Text className="text-lg font-semibold text-blue-700">
              {session.name}
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Text className="block font-semibold text-gray-500 mb-1">
                Khóa học:
              </Text>
              <Text className="text-base text-gray-900">
                {getCourseName(session.courseId)}
              </Text>
            </div>

            <div>
              <Text className="block font-semibold text-gray-500 mb-1">
                Vị trí trong khóa học:
              </Text>
              <Text className="text-base text-gray-900">
                {session.positionOrder || "N/A"}
              </Text>
            </div>
          </div>

          <Divider style={{ borderColor: "#e5e7eb" }} />

          <div>
            <Text className="block font-semibold text-gray-500 mb-1">
              Nội dung buổi học:
            </Text>
            <Paragraph
              className="text-gray-800 whitespace-pre-line bg-gray-50 p-3 rounded-md border border-gray-100"
              style={{ marginBottom: 0 }}
            >
              {session.content || "Không có nội dung"}
            </Paragraph>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          Không tìm thấy dữ liệu buổi học.
        </div>
      )}
    </Modal>
  );
};

export default ViewSession;
