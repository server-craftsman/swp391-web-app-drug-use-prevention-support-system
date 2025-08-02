import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Spin,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Tag,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import type { Session } from "../../../../types/session/Session.res.type";
import type { Course } from "../../../../types/course/Course.res.type";
import { SessionService } from "../../../../services/session/session.service";
import { formatDate } from "../../../../utils/helper";

const { Title, Text } = Typography;

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
      width={800}
      centered
      className="session-detail-modal"
      styles={{
        body: {
          padding: '24px 32px'
        },
        content: {
          borderRadius: '16px',
          background: 'white'
        },
        header: {
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          padding: '24px 32px 0'
        }
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <ClockCircleOutlined className="text-white text-xl" />
          </div>
          <div>
            <Title level={3} className="!mb-1 text-gray-800">Chi tiết buổi học</Title>
            <Text className="text-gray-500">Xem thông tin chi tiết buổi học</Text>
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : session ? (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <Title level={2} className="!mb-1 text-gray-800">{session.name}</Title>
                  <div className="flex items-center gap-3">
                    <Tag color="green" className="text-sm px-3 py-1 rounded-full">
                      <PlayCircleOutlined />
                      BUỔI HỌC
                    </Tag>
                    <Text className="text-gray-500">#{session.positionOrder}</Text>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {(session as any)?.lessons?.length || 0}
                </div>
                <div className="text-sm text-gray-500">bài học</div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={16}>
            <Col span={12}>
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
                <Statistic
                  title="Khóa học"
                  value={getCourseName(session.courseId)}
                  valueStyle={{ color: '#10b981', fontSize: '16px' }}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200 h-24 flex items-center justify-center">
                <Statistic
                  title="Thứ tự"
                  value={session.positionOrder || 0}
                  valueStyle={{ color: '#8b5cf6', fontSize: '16px' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Content Section */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                <span className="font-semibold text-gray-700">Nội dung buổi học</span>
              </div>
            }
            className="border-0 shadow-sm"
          >
            {session.content ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: session.content
                  }}
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <FileTextOutlined className="text-4xl text-gray-400 mb-2" />
                <Text type="secondary" className="text-lg">Không có nội dung</Text>
              </div>
            )}
          </Card>

          {/* Session Information */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600"
                />
                <div>
                  <Text className="block font-semibold text-gray-500 text-sm">Buổi học</Text>
                  <Text className="text-lg font-semibold text-gray-800">{session.name}</Text>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarOutlined />
                  <Text className="text-sm">
                    {(session as any)?.createdAt ? formatDate(new Date((session as any).createdAt)) : 'N/A'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Lessons Preview (if available) */}
          {(session as any)?.lessons && (session as any).lessons.length > 0 && (
            <Card
              title={
                <div className="flex items-center gap-2">
                  <BookOutlined className="text-purple-500" />
                  <span className="font-semibold text-gray-700">Danh sách bài học ({(session as any).lessons.length})</span>
                </div>
              }
              className="border-0 shadow-sm"
            >
              <div className="space-y-3">
                {(session as any).lessons.map((lesson: any, index: number) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Text className="font-semibold text-gray-800">{lesson.name}</Text>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag color="blue" className="text-xs">
                          {lesson.lessonType.toUpperCase()}
                        </Tag>
                        <Text className="text-xs text-gray-500">#{lesson.positionOrder}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">⏰</div>
            <Title level={4} className="text-gray-600 mb-2">Không tìm thấy buổi học</Title>
            <Text className="text-gray-500">Vui lòng kiểm tra lại thông tin buổi học</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewSession;
