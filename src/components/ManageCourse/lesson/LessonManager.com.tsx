import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import type { Course } from "../../../types/course/Course.res.type";
import type { Session } from "../../../types/session/Session.res.type";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";

import { CourseService } from "../../../services/course/course.service";
import { SessionService } from "../../../services/session/session.service";
import { LessonService } from "../../../services/lesson/lesson.service";

import CreateLessonForm from "./CreateLessonForm.com";
import UpdateLessonForm from "./UpdateLessonForm.com";
import DeleteLesson from "./DeleteLesson.com";

const { Option } = Select;

const LessonManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchSessions(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedSessionId) fetchLessons(selectedSessionId);
  }, [selectedSessionId]);

  const fetchCourses = async () => {
    try {
      const res = await CourseService.getAllCourses({
        PageNumber: 1,
        PageSize: 100,
      });
      const data = res.data?.data || [];
      setCourses(data);
    } catch {
      message.error("Lỗi khi tải danh sách khóa học");
    }
  };

  const fetchSessions = async (courseId: string) => {
    try {
      const res = await SessionService.getSessionByCourseId({
        CourseId: courseId,
      });
      const data = res.data || [];
      setSessions(data.data);
    } catch {
      message.error("Lỗi khi tải danh sách phiên học");
    }
  };

  const fetchLessons = async (sessionId: string) => {
    setLoading(true);
    try {
      const res = await LessonService.getLessonBySessionId({
        SessionId: sessionId,
      });
      const data = res.data || [];
      setLessons(data.data);
    } catch {
      message.error("Lỗi khi tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    if (selectedSessionId) fetchLessons(selectedSessionId);
  };

  const handleUpdated = () => {
    setShowUpdateModal(false);
    if (selectedSessionId) fetchLessons(selectedSessionId);
  };

  const openUpdateModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowUpdateModal(true);
  };

  const columns: ColumnsType<Lesson> = [
    {
      title: "Tên bài học",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
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
      title: "Ảnh minh họa",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="Ảnh minh họa"
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span>Chưa có ảnh</span>
        ),
    },
    {
      title: "Thứ tự",
      dataIndex: "positionOrder",
      key: "positionOrder",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteLesson
              lessonId={record.id}
              onDeleted={() => fetchLessons(selectedSessionId!)}
              buttonProps={{
                icon: <DeleteOutlined />,
                size: "small",
                danger: true,
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
        <div>
          <span>Khóa Học : </span>
          <Select
            style={{ width: 220 }}
            placeholder="Chọn khóa học"
            onChange={(id) => {
              setSelectedCourseId(id);
              setSelectedSessionId(null);
              setLessons([]);
            }}
            value={selectedCourseId || undefined}
          >
            {courses.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span>Buổi Học : </span>
          <Select
            style={{ width: 220 }}
            placeholder="Chọn phiên học"
            disabled={!selectedCourseId}
            onChange={(id) => setSelectedSessionId(id)}
            value={selectedSessionId || undefined}
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
          disabled={!selectedCourseId || !selectedSessionId}
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
        title="Tạo bài học mới"
        width={600}
      >
        {selectedCourseId && selectedSessionId && (
          <CreateLessonForm
            courseId={selectedCourseId}
            sessionId={selectedSessionId}
            onSuccess={handleCreated}
          />
        )}
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        title="Cập nhật bài học"
        width={600}
      >
        {editingLesson && (
          <UpdateLessonForm lesson={editingLesson} onSuccess={handleUpdated} />
        )}
      </Modal>
    </div>
  );
};

export default LessonManager;
