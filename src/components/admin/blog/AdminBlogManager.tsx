import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import type { Blog } from "../../../types/blog/Blog.res.type";
import { Table, Button, message, Image, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateBlogForm from "./CreateBlog.com";
import DeleteBlog from "./DeleteBlog.com"; // Thêm dòng này
import UpdateBlogForm from "./UpdateBlog.com";
import CustomPagination from "../../common/Pagiation.com"; // Đảm bảo đúng đường dẫn
import { Tooltip } from "antd";

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    setLoading(true);
    const params: BlogRequest = { pageNumber: current, pageSize };
    try {
      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      setBlogs(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0); // <-- Lấy đúng trường totalCount
    } catch (err) {
      setBlogs([]);
      message.error("Lỗi khi lấy danh sách blog!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [current, pageSize]);

  const handleBlogCreated = () => {
    setShowModal(false);
    fetchBlogs();
  };

  const handleBlogUpdated = () => {
    setShowUpdateModal(false);
    fetchBlogs();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "blogImgUrl",
      key: "blogImgUrl",
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="blog"
            width={80}
            height={60}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: "pre-line" }}>{text}</div>
      ),
    },
    {
      title: "Người đăng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) =>
        isDeleted ? (
          <span className="text-red-500">Đã xóa</span>
        ) : (
          <span className="text-green-600">Hoạt động</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Blog) => (
        <div className="flex gap-2">
          {!record.isDeleted && (
            <>
              <Tooltip title="Cập nhật">
                <Button
                  icon={<EditOutlined />}
                  shape="circle"
                  type="default"
                  size="small"
                  onClick={() => {
                    setSelectedBlog(record);
                    setShowUpdateModal(true);
                  }}
                  style={{ borderColor: "#1677ff", color: "#1677ff" }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <DeleteBlog
                  blogId={record.id}
                  onDeleted={fetchBlogs}
                  buttonProps={{
                    icon: <DeleteOutlined />,
                    shape: "circle",
                    danger: true,
                    size: "small",
                    style: { borderColor: "#ff4d4f", color: "#ff4d4f" },
                  }}
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  console.log(blogs);
  console.log("total:", total, "pageSize:", pageSize);
  return (
    <div className="p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Quản lý Blog</h2>
      <Button
        type="primary"
        className="absolute top-6 right-6 bg-[#20558A]"
        onClick={() => setShowModal(true)}
      >
        Tạo blog mới
      </Button>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        pagination={false} // Tắt phân trang mặc định của Table
        bordered
      />
      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total} // total = 18
        onChange={handlePageChange}
      />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title="Tạo blog mới"
        width={600}
      >
        <CreateBlogForm onSuccess={handleBlogCreated} />
      </Modal>
      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        title="Cập nhật blog"
        width={600}
        destroyOnClose
      >
        {selectedBlog && (
          <UpdateBlogForm blog={selectedBlog} onSuccess={handleBlogUpdated} />
        )}
      </Modal>
    </div>
  );
};

export default AdminBlogManager;
