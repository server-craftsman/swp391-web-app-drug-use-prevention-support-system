import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Tag, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

import type { Course } from "../../../../types/course/Course.res.type";
import type { Session } from "../../../../types/session/Session.res.type";
import type { Lesson } from "../../../../types/lesson/Lesson.res.type";

import { CourseService } from "../../../../services/course/course.service";
import { SessionService } from "../../../../services/session/session.service";
import { LessonService } from "../../../../services/lesson/lesson.service";

import CreateLessonForm from "./CreateLessonForm.com";
import UpdateLessonForm from "./UpdateLessonForm.com";
import DeleteLesson from "./DeleteLesson.com";
import { formatDate } from "../../../../utils/helper";
import CustomSearch from "../../../common/CustomSearch.com";
import ViewLesson from "./ViewLesson.com";
const { Option } = Select;

const formatStatusTag = (value: string) => (
  <Tag style={{ backgroundColor: "#1890ff", color: "#fff", border: 0 }}>
    {value.toUpperCase()}
  </Tag>
);

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sessionFilter, setSessionFilter] = useState<string | null>(null); // ✅ Filter session
  const [viewLessonId, setViewLessonId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [courseRes, sessionRes] = await Promise.all([
          CourseService.getAllCourses({ pageNumber: 1, pageSize: 100 }),
          SessionService.getAllSessions({ pageNumber: 1, pageSize: 100 }),
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
  }, [searchKeyword]);

  const fetchLessons = async (
    coursesData: Course[] = courses,
    sessionsData: Session[] = sessions
  ) => {
    setLoading(true);
    try {
      const res = await LessonService.getAllLessons({
        pageNumber: 1,
        pageSize: 1000,
        filterByName: searchKeyword,
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

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
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
  const openViewModal = (id: string) => {
    setViewLessonId(id);
    setShowViewModal(true);
  };
  const filteredLessons = sessionFilter
    ? lessons.filter((lesson) => lesson.sessionId === sessionFilter)
    : lessons;

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
          <span
            dangerouslySetInnerHTML={{
              __html:
                text?.length > 50 ? text.slice(0, 50) + "..." : text || "-",
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Tag color="cyan">{formatDate(new Date(date))}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              type="default"
              size="small"
              onClick={() => openViewModal(record.id)}
            />
          </Tooltip>
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
      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CustomSearch
            onSearch={handleSearch}
            placeholder="Tìm kiếm theo tên bài học"
            inputWidth="w-80"
          />

          {/* ✅ Filter sessionName */}
          <Select
            allowClear
            showSearch
            placeholder="Lọc theo phiên học"
            className="w-60"
            value={sessionFilter ?? undefined}
            onChange={(value) => setSessionFilter(value ?? null)}
            optionFilterProp="children"
          >
            {sessions.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
        </div>

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
        dataSource={filteredLessons}
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
      <ViewLesson
        lessonId={viewLessonId}
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        courses={courses}
        sessions={sessions}
      />
    </div>
  );
};

export default LessonManager;
