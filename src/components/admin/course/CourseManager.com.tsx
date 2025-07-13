import { useEffect, useState } from "react";
import { CourseService } from "../../../services/course/course.service";
import type { CourseRequest } from "../../../types/course/Course.req.type";
import type { Course } from "../../../types/course/Course.res.type";
import {
  Table,
  Button,
  message,
  Image,
  Modal,
  Tooltip,
  Tag,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import CreateCourseForm from "./CreateCourseForm.com";
import UpdateCourseForm from "./UpdateCourseForm.com";
import DeleteCourse from "./DeleteCourse.com";
import CustomPagination from "../../common/Pagiation.com";
import CustomSearch from "../../common/CustomSearch.com";
import ViewCourse from "./ViewCourse.com";

const { Option } = Select;

const AdminCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const fetchCourses = async () => {
    setLoading(true);
    const params: CourseRequest = {
      pageNumber: current,
      pageSize: pageSize,
      filterByName: searchKeyword,
    };
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
  }, [current, pageSize, searchKeyword]);

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

  // Filter bằng frontend theo status
  const filteredCourses = statusFilter
    ? courses.filter((course) => course.status === statusFilter)
    : courses;

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrls",
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
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) =>
        discount > 0 ? (
          <Tag color="red">-{discount?.toLocaleString("vi-VN")}%</Tag>
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <div className="text-right">{price?.toLocaleString("vi-VN")}₫</div>
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
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              type="default"
              size="small"
              onClick={() => {
                setViewingCourseId(record.id);
                setViewModalOpen(true);
              }}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        {/* Bên trái: Search + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CustomSearch
            onSearch={(keyword) => {
              setCurrent(1);
              setSearchKeyword(keyword);
            }}
            placeholder="Tìm kiếm theo tên khóa học"
            inputWidth="w-80"
          />

          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            className="w-60"
            value={statusFilter ?? undefined}
            onChange={(value) => setStatusFilter(value ?? null)}
          >
            <Option value="draft">Nháp (draft)</Option>
            <Option value="published">Đã xuất bản (published)</Option>
            <Option value="archived">Lưu trữ (archived)</Option>
          </Select>
        </div>

        {/* Bên phải: Nút tạo mới */}
        <Button
          type="primary"
          className="bg-[#20558A]"
          onClick={() => setShowCreateModal(true)}
        >
          Tạo khóa học mới
        </Button>
      </div>

      {/* Bảng danh sách khóa học */}
      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />

      {/* Phân trang */}
      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      {/* Modal tạo khóa học */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <CreateCourseForm onSuccess={handleCourseCreated} />
      </Modal>

      {/* Modal cập nhật khóa học */}
      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        width={600}
      >
        {editingCourse && (
          <UpdateCourseForm
            course={editingCourse}
            onSuccess={handleCourseUpdated}
          />
        )}
      </Modal>
      {viewingCourseId && (
        <ViewCourse
          courseId={viewingCourseId}
          open={viewModalOpen}
          onClose={() => {
            setViewingCourseId(null);
            setViewModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminCourseManager;
