import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import type { Blog } from "../../../types/blog/Blog.res.type";
import { Table, Button, Popconfirm, message, Image, Modal } from "antd";
import CreateBlogForm from "./CreateBlog.com"; // Đảm bảo đúng đường dẫn

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const params: BlogRequest = { pageNumber: 1, pageSize: 20 };
    try {
      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      setBlogs(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setBlogs([]);
      message.error("Lỗi khi lấy danh sách blog!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Hàm xóa blog (giả lập, bạn cần thay bằng API thật)
  const handleDelete = async (id: string) => {
    try {
      // await BlogService.deleteBlog(id); // Nếu có API xóa
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      message.success("Đã xóa blog!");
    } catch {
      message.error("Xóa blog thất bại!");
    }
  };

  // Khi tạo blog thành công, reload lại danh sách và đóng modal
  const handleBlogCreated = () => {
    setShowModal(false);
    fetchBlogs();
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
      render: (_: any, record: Blog) =>
        !record.isDeleted && (
          <Popconfirm
            title="Bạn chắc chắn muốn xóa blog này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Quản lý Blog</h2>
      <Button
        type="primary"
        className="absolute top-6 right-6"
        onClick={() => setShowModal(true)}
      >
        Tạo blog mới
      </Button>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title="Tạo blog mới"
        destroyOnClose
        width={600}
      >
        <CreateBlogForm onSuccess={handleBlogCreated} />
      </Modal>
    </div>
  );
};

export default AdminBlogManager;
