import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, Divider, Collapse } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import { SessionService } from "../../../services/session/session.service";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

import LessonVideo from "./LessonVideo.com";
import { ROUTER_URL } from "../../../consts/router.path.const";

const { Title } = Typography;
const { Panel } = Collapse;

const LessonDetail: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  // Thêm state để lưu lessons
  const [sessionsWithLessons, setSessionsWithLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        if (lessonId) {
          const res = await LessonService.getLessonById({ lessonId });
          if (res.data?.success && res.data?.data) {
            setLesson(res.data.data as Lesson);
          } else {
            setLesson(null);
          }
        }
      } catch (err) {
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!lesson?.sessionId) return;
      try {
        const res = await SessionService.getSessionById({
          id: lesson.sessionId,
        });
        if (res.data?.success && res.data?.data) {
          setSession(res.data.data as Session);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };
    if (lesson?.sessionId) fetchSession();
  }, [lesson?.sessionId]);

  // Fetch course và tất cả sessions + lessons
  useEffect(() => {
    const fetchCourseAndSessions = async () => {
      if (!lesson?.courseId) return;
      setSidebarLoading(true);
      try {
        // Fetch all sessions của course
        const sessionsRes = await SessionService.getSessionByCourseId({
          CourseId: lesson.courseId,
        });

        if (
          sessionsRes.data?.success &&
          Array.isArray(sessionsRes.data?.data)
        ) {
          const sessions = sessionsRes.data.data as Session[];
          // KHÔNG CẦN SET allSessions VÌ KHÔNG DÙNG
          // setAllSessions(sessions);

          // Fetch lessons cho từng session
          const sessionsWithLessonsData = await Promise.all(
            sessions.map(async (sessionItem) => {
              try {
                const lessonsRes = await LessonService.getLessonBySessionId({
                  SessionId: sessionItem.id,
                });

                return {
                  ...sessionItem,
                  lessons:
                    lessonsRes.data?.success &&
                    Array.isArray(lessonsRes.data?.data)
                      ? lessonsRes.data.data
                      : [],
                };
              } catch {
                return {
                  ...sessionItem,
                  lessons: [],
                };
              }
            })
          );

          setSessionsWithLessons(sessionsWithLessonsData);
        } else {
          // KHÔNG CẦN SET allSessions VÌ KHÔNG DÙNG
          // setAllSessions([]);
          setSessionsWithLessons([]);
        }
      } catch {
        // KHÔNG CẦN SET course VÀ allSessions VÌ KHÔNG DÙNG
        // setCourse(null);
        // setAllSessions([]);
        setSessionsWithLessons([]);
      } finally {
        setSidebarLoading(false);
      }
    };
    if (lesson?.courseId) fetchCourseAndSessions();
  }, [lesson?.courseId]);

  // Thêm hàm chọn icon theo lessonType
  const getLessonIcon = (lessonType?: string) => {
    switch ((lessonType || "").toLowerCase()) {
      case "video":
        return <PlayCircleOutlined className="text-blue-500 text-sm" />;
      case "text":
        return <FileTextOutlined className="text-green-500 text-sm" />;
      case "image":
        return <PictureOutlined className="text-orange-500 text-sm" />;
      default:
        return <FileTextOutlined className="text-gray-400 text-sm" />;
    }
  };

  // Render sidebar - SỬA PHẦN XỬ LÝ LESSONS
  const renderSidebar = () => (
    <div
      style={{
        width: 350,
        borderRadius: 12,
        padding: 20,
        marginRight: 24,
        border: "1px solid #e6eaf0",
        height: "fit-content",
        position: "sticky",
        top: 20,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 20,
          color: "#20558A",
        }}
      >
        Course Content
      </div>
      {sidebarLoading ? (
        <Spin />
      ) : (
        <Collapse
          ghost
          defaultActiveKey={[session?.id || ""]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="text-gray-500"
            />
          )}
          expandIconPosition="end"
        >
          {sessionsWithLessons.map((sessionItem) => (
            <Panel
              key={sessionItem.id}
              header={
                <div className="flex items-center justify-between w-full pr-4">
                  <span style={{ fontWeight: 600, color: "#333" }}>
                    {sessionItem.name}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {sessionItem.lessons?.length || 0} bài
                  </span>
                </div>
              }
              className="border-b border-gray-200 last:border-b-0"
              style={{
                marginBottom: 8,
                border: "1px solid #e6eaf0",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              {sessionItem.lessons && sessionItem.lessons.length > 0 ? (
                <div className="space-y-1 pb-4">
                  {sessionItem.lessons.map((lessonItem: Lesson) => (
                    <div
                      key={lessonItem.id}
                      className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                      onClick={() => {
                        console.log("Clicked lesson:", lessonItem); // Debug
                        console.log("Current lessonId:", lessonId); // Debug
                        console.log("Target lessonId:", lessonItem.id); // Debug

                        if (lessonItem.id !== lessonId) {
                          // SỬA: Thay thế :lessonId bằng ID thực
                          navigate(
                            ROUTER_URL.CUSTOMER.LESSON_DETAIL.replace(
                              ":lessonId",
                              lessonItem.id
                            )
                          );
                        }
                      }}
                      style={{
                        backgroundColor:
                          lessonItem.id === lessonId
                            ? "#e6f7ff"
                            : "transparent",
                        borderLeft:
                          lessonItem.id === lessonId
                            ? "3px solid #20558A"
                            : "3px solid transparent",
                        fontWeight: lessonItem.id === lessonId ? 600 : 400,
                        color: lessonItem.id === lessonId ? "#20558A" : "#666",
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {getLessonIcon(lessonItem.lessonType)}
                        <span className="text-gray-700 text-sm">
                          {lessonItem.name}
                        </span>

                        {/* Hiển thị ảnh thumbnail nếu có */}
                        {/* {lessonItem.imageUrl && lessonItem.imageUrl !== "" && (
                          <img
                            src={lessonItem.imageUrl}
                            alt={lessonItem.name}
                            style={{
                              maxWidth: 60,
                              maxHeight: 40,
                              marginLeft: 8,
                              borderRadius: 4,
                              border: "1px solid #eee",
                              objectFit: "cover",
                            }}
                          />
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600 text-sm py-4 px-4">
                  Phần này chưa có bài giảng
                </div>
              )}
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Title level={3}>Không tìm thấy bài học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "32px auto",
        padding: "0 16px",
        display: "flex",
        gap: 0,
      }}
    >
      {/* Sidebar bên trái */}
      {renderSidebar()}

      {/* Nội dung chính bên phải */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e6eaf0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Title Section */}
        <div style={{ padding: "20px 40px 40px 40px" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#333",
              margin: 0,
              marginBottom: 8,
            }}
          >
            {lesson.name}
          </h1>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Content Section */}
        <div style={{ padding: "40px" }}>
          {/* Lesson Image */}
          {lesson.imageUrl && (
            <div style={{ marginBottom: 32, textAlign: "left" }}>
              <img
                src={lesson.imageUrl}
                alt={lesson.name}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 8,
                }}
              />
            </div>
          )}

          {/* Main Content */}
          {lesson.content && (
            <div
              style={{
                lineHeight: 1.8,
                color: "#444",
                fontSize: "16px",
                marginBottom: 40,
              }}
              dangerouslySetInnerHTML={{
                __html: lesson.content,
              }}
            />
          )}

          {/* Video Section */}
          {lesson.videoUrl && (
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <LessonVideo
                videoUrl={lesson.videoUrl}
                imageUrl={lesson.imageUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
