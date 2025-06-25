import { useEffect, useState } from "react";
import { CourseService } from "../../../services/course/course.service";
import type { CourseRequest } from "../../../types/course/Course.req.type";
import type { Course } from "../../../types/course/Course.res.type";
import { Table, Button, message, Image, Modal, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateCourseForm from "./CreateCourse.com";
import UpdateCourseForm from "./UpdateCourse.com"; // import form update
import DeleteCourse from "./DeleteCourse.com";
import CustomPagination from "../../common/Pagiation.com";

const AdminCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const fetchCourses = async () => {
    setLoading(true);
    const params: CourseRequest = { PageNumber: current, PageSize: pageSize };
    try {
      const res = await CourseService.getAllCourses(params);
      const data = res.data as any;
      setCourses(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setCourses([]);
      message.error("Lỗi khi lấy danh sách khóa học!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [current, pageSize]);

  const handleCourseCreated = () => {
    setShowCreateModal(false);
    fetchCourses();
  };

  const handleCourseUpdated = () => {
    setShowUpdateModal(false);
    fetchCourses();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const openUpdateModal = (course: Course) => {
    setEditingCourse(course);
    setShowUpdateModal(true);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="course"
            width={80}
            height={60}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div style={{ maxWidth: 200, fontWeight: 600 }}>{text}</div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>{price?.toLocaleString("vi-VN")}₫</span>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) =>
        discount > 0 ? (
          <Tag color="red">-{Math.round(discount * 100)}%</Tag>
        ) : (
          <span>Không</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "published"
              ? "green"
              : status === "archived"
              ? "orange"
              : "default"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Course) => (
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
            <DeleteCourse
              courseId={record.id}
              onDeleted={fetchCourses}
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
    <div className="p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Quản lý Khóa học</h2>
      <Button
        type="primary"
        className="absolute top-6 right-6 bg-[#20558A]"
        onClick={() => setShowCreateModal(true)}
      >
        Tạo khóa học mới
      </Button>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />
      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />
      {/* Modal tạo mới */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        title="Tạo khóa học mới"
        width={600}
      >
        <CreateCourseForm onSuccess={handleCourseCreated} />
      </Modal>
      {/* Modal cập nhật */}
      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        title="Cập nhật khóa học"
        width={600}
      >
        {editingCourse && (
          <UpdateCourseForm
            course={editingCourse}
            onSuccess={handleCourseUpdated}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminCourseManager;
