import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, Divider } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import { SessionService } from "../../../services/session/session.service";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LessonHeader from "./LessonHeader.com";
import LessonMain from "./LessonMain.com";
import LessonMeta from "./LessonMeta.com";
import LessonTeacher from "./LessonTeacher.com";
import LessonVideo from "./LessonVideo.com";

const { Title } = Typography;

const LessonDetail: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

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
      className="mx-auto py-8 px-4 bg-white rounded-2xl shadow-lg"
      style={{
        maxWidth: 1000, // tăng chiều ngang tối đa
        border: "1px solid #e6eaf0",
        marginTop: 32,
        marginBottom: 32,
      }}
    >
      {/* Nút quay lại */}
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="link"
          style={{ paddingLeft: 0, fontSize: 16 }}
        >
          Quay lại
        </Button>
      </div>

      <LessonHeader sessionName={session?.name} lessonName={lesson.name} />
      <LessonTeacher lesson={lesson} />
      <LessonMeta lesson={lesson} />
      <Divider />
      <LessonMain imageUrl={lesson.imageUrl} content={lesson.content} />
      <LessonVideo videoUrl={lesson.videoUrl} imageUrl={lesson.imageUrl} />
    </div>
  );
};

export default LessonDetail;
