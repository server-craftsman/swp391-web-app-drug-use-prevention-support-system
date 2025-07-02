import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

import type { Session } from "../../../../types/session/Session.res.type";
import type { Course } from "../../../../types/course/Course.res.type";

import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";

import CreateSessionForm from "./CreateSessionForm.com";
import UpdateSessionForm from "./UpdateSessionForm.com";
import DeleteSession from "./DeleteSession.com";
import CustomSearch from "../../../common/CustomSearch.com";

const { Option } = Select;

const SessionManager = () => {
  const [sessions, setSessions] = useState<
    (Session & { courseName?: string; courseId: string })[]
  >([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courseFilter, setCourseFilter] = useState<string | null>(null); // ✅ State filter course
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const courseRes = await CourseService.getAllCourses({
          pageNumber: 1,
          pageSize: 100,
        });
        const courseList = courseRes.data?.data || [];
        setCourses(courseList);
        await fetchSessions(courseList);
      } catch {
        message.error("Lỗi khi tải danh sách khóa học hoặc buổi học");
      }
    };

    loadAll();
  }, [searchKeyword]);

  const fetchSessions = async (courseList: Course[] = courses) => {
    setLoading(true);
    try {
      const res = await SessionService.getAllSessions({
        pageNumber: 1,
        pageSize: 1000,
        name: searchKeyword,
      });
      const rawSessions: Session[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const sessionsWithCourseNames = rawSessions.map((session) => {
        const course = courseList.find((c) => c.id === session.courseId);
        return {
          ...session,
          courseName: course?.name || "-",
          courseId: course?.id || "",
        };
      });

      setSessions(sessionsWithCourseNames);
    } catch {
      message.error("Lỗi khi tải danh sách phiên học");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchSessions();
  };

  const handleUpdated = () => {
    setShowUpdateModal(false);
    fetchSessions();
  };

  const openUpdateModal = (session: Session) => {
    setEditingSession(session);
    setShowUpdateModal(true);
  };

  // ✅ Filter FE theo courseId
  const filteredSessions = courseFilter
    ? sessions.filter((s) => s.courseId === courseFilter)
    : sessions;

  const columns: ColumnsType<(typeof sessions)[0]> = [
    {
      title: "Tên buổi học",
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
            <DeleteSession
              sessionId={record.id}
              onDeleted={() => fetchSessions()}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CustomSearch
            onSearch={handleSearch}
            placeholder="Tìm kiếm theo tên buổi học"
            inputWidth="w-80"
          />

          {/* ✅ Filter khóa học FE */}
          <Select
            allowClear
            showSearch
            placeholder="Lọc theo khóa học"
            className="w-60"
            value={courseFilter ?? undefined}
            onChange={(value) => setCourseFilter(value ?? null)}
            optionFilterProp="children"
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
          onClick={() => setShowCreateModal(true)}
        >
          Thêm buổi học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSessions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <CreateSessionForm courses={courses} onSuccess={handleCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        width={600}
      >
        {editingSession && (
          <UpdateSessionForm
            session={editingSession}
            onSuccess={handleUpdated}
            courses={courses}
          />
        )}
      </Modal>
    </div>
  );
};

export default SessionManager;
