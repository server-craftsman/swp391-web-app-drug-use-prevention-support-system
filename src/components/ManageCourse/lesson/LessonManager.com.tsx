import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

import type { Course } from "../../../types/course/Course.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";

import { CourseService } from "../../../services/course/course.service";
import { SessionService } from "../../../services/session/session.service";
import { LessonService } from "../../../services/lesson/lesson.service";

import CreateLessonForm from "./CreateLessonForm.com";
import UpdateLessonForm from "./UpdateLessonForm.com";
import DeleteLesson from "./DeleteLesson.com";

const formatStatusTag = (value: string) => {
  return (
    <Tag style={{ backgroundColor: "#1890ff", color: "#fff", border: 0 }}>
      {value.toUpperCase()}
    </Tag>
  );
};

const LessonManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessons, setLessons] = useState<
    (Lesson & {
      courseName?: string;
      courseId?: string;
      sessionName?: string;
    })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [courseRes, sessionRes] = await Promise.all([
          CourseService.getAllCourses({ PageNumber: 1, PageSize: 100 }),
          SessionService.getAllSessions({ PageNumber: 1, PageSize: 100 }),
        ]);

        const courseData = courseRes.data || [];
        const sessionData = sessionRes.data || [];

        setCourses(courseData.data);
        setSessions(sessionData.data);
        await fetchLessons(courseData.data, sessionData.data);
      } catch {
        message.error("Lỗi khi tải dữ liệu");
      }
    };

    loadAll();
  }, []);

  const fetchLessons = async (
    coursesData: Course[] = courses,
    sessionsData: Session[] = sessions
  ) => {
    setLoading(true);
    try {
      const res = await LessonService.getAllLessons({
        PageNumber: 1,
        PageSize: 1000,
      });
      const rawLessons: Lesson[] = res.data?.data || [];

      const lessonsWithNames = rawLessons.map((lesson) => {
        const course = coursesData.find((c) => c.id === lesson.courseId);
        const session = sessionsData.find((s) => s.id === lesson.sessionId);
        return {
          ...lesson,
          courseName: course?.name || "-",
          courseId: course?.id || "",
          sessionName: session?.name || "-",
        };
      });

      setLessons(lessonsWithNames);
    } catch {
      message.error("Lỗi khi tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchLessons();
  };

  const handleUpdated = () => {
    setShowUpdateModal(false);
    fetchLessons();
  };

  const openUpdateModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowUpdateModal(true);
  };

  const columns: ColumnsType<
    Lesson & { courseName?: string; courseId?: string; sessionName?: string }
  > = [
    {
      title: "Tên bài học",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
      render: (_, record) =>
        record.courseId ? (
          <Link
            to={`/courses/${record.courseId}`}
            className="text-blue-600 hover:underline"
          >
            {record.courseName}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      title: "Phiên học",
      dataIndex: "sessionName",
      key: "sessionName",
    },
    {
      title: "Loại bài học",
      dataIndex: "lessonType",
      key: "lessonType",
      render: (value: string) => formatStatusTag(value),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Tooltip title={text}>
          <span>
            {text?.length > 50 ? text.slice(0, 50) + "..." : text || "-"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Tag color="cyan">{new Date(date).toLocaleString()}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              type="default"
              size="small"
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteLesson
              lessonId={record.id}
              onDeleted={() => fetchLessons()}
              buttonProps={{
                icon: <DeleteOutlined />,
                shape: "circle",
                danger: true,
                size: "small",
                style: { borderColor: "#ff4d4f", color: "#ff4d4f" },
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Quản lý Bài học</h2>
        <Button
          className="bg-[#20558A] hover-primary"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setShowCreateModal(true)}
        >
          Thêm bài học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <CreateLessonForm courses={courses} onSuccess={handleCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        width={600}
      >
        {editingLesson && (
          <UpdateLessonForm
            lesson={editingLesson}
            onSuccess={handleUpdated}
            courses={courses}
          />
        )}
      </Modal>
    </div>
  );
};

export default LessonManager;
