import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import type { Session } from "../../../types/session/Session.res.type";
import type { Course } from "../../../types/course/Course.res.type";

import { SessionService } from "../../../services/session/session.service";
import { CourseService } from "../../../services/course/course.service";

import CreateSessionForm from "./CreateSessionForm.com";
import UpdateSessionForm from "./UpdateSessionForm.com";
import DeleteSession from "./DeleteSession.com";

const { Option } = Select;

const SessionManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // ✅ Lấy danh sách khóa học
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await CourseService.getAllCourses({
        PageNumber: 1,
        PageSize: 100,
      });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setCourses(list);
      if (list.length > 0) setSelectedCourseId(list[0].id);
    } catch {
      message.error("Lỗi khi tải danh sách khóa học");
    } finally {
      setLoadingCourses(false);
    }
  };

  // ✅ Gọi API getSessionByCourseId
  const fetchSessions = async (courseId: string | null) => {
    if (!courseId) {
      setSessions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await SessionService.getSessionByCourseId({
        CourseId: courseId,
      });
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setSessions(list);
    } catch {
      message.error("Lỗi khi tải danh sách phiên học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchSessions(selectedCourseId);
  }, [selectedCourseId]);

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchSessions(selectedCourseId);
  };

  const handleUpdated = () => {
    setShowUpdateModal(false);
    fetchSessions(selectedCourseId);
  };

  const openUpdateModal = (session: Session) => {
    setEditingSession(session);
    setShowUpdateModal(true);
  };

  const columns: ColumnsType<Session> = [
    {
      title: "Tên phiên học",
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
            <DeleteSession
              sessionId={record.id}
              onDeleted={() => fetchSessions(selectedCourseId)}
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
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold">Quản Lý Buổi Học</h2>
        <div>
          <span>Khóa Học : </span>
          <Select
            loading={loadingCourses}
            style={{ width: 250 }}
            value={selectedCourseId}
            onChange={(value) => setSelectedCourseId(value)}
            placeholder="Chọn khóa học"
          >
            {courses.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          className="bg-[#20558A] hover-primary"
          icon={<PlusOutlined />}
          type="primary"
          disabled={!selectedCourseId}
          onClick={() => setShowCreateModal(true)}
        >
          Thêm phiên học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sessions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        title="Tạo phiên học mới"
        width={600}
      >
        {selectedCourseId && (
          <CreateSessionForm
            courseId={selectedCourseId}
            onSuccess={handleCreated}
          />
        )}
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        title="Cập nhật phiên học"
        width={600}
      >
        {editingSession && (
          <UpdateSessionForm
            session={editingSession}
            onSuccess={handleUpdated}
          />
        )}
      </Modal>
    </div>
  );
};

export default SessionManager;
