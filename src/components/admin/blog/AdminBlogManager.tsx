import { useEffect, useState } from "react";
import { BlogService } from "../../../services/blog/blog.service";
import type { BlogRequest } from "../../../types/blog/Blog.req.type";
import type { Blog } from "../../../types/blog/Blog.res.type";
import { Table, Button, message, Image, Modal, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import CreateBlogForm from "./CreateBlog.com";
import DeleteBlog from "./DeleteBlog.com";
import UpdateBlogForm from "./UpdateBlog.com";
import CustomPagination from "../../common/Pagiation.com";
import CustomSearch from "../../common/CustomSearch.com";
import { helpers } from "../../../utils";

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Thêm state cho View
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const params: BlogRequest = {
      pageNumber: current,
      pageSize: pageSize,
      filterByContent: searchKeyword,
    };
    try {
      const res = await BlogService.getAllBlogs(params);
      const data = res.data as any;
      setBlogs(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setBlogs([]);
      message.error("Lỗi khi lấy danh sách blog!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [current, pageSize, searchKeyword]);

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

  // Hàm view blog
  const handleViewBlog = async (id: string) => {
    setShowViewModal(true);
    setViewLoading(true);
    try {
      const res = await BlogService.getBlogById({ id });
      setViewingBlog(res.data?.data || null);
    } catch {
      setViewingBlog(null);
      message.error("Không thể tải chi tiết blog!");
    } finally {
      setViewLoading(false);
    }
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
      render: (_: string, record: Blog) => (
        <div className="flex items-center gap-2">
          <img
            src={record.userAvatar || "/no-avatar.png"}
            alt={record.fullName || "Không rõ"}
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span>{record.fullName || "Không rõ"}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => helpers.formatDate(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Blog) => (
        <div className="flex gap-2">
          {!record.isDeleted && (
            <>
              <Tooltip title="Xem chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  shape="circle"
                  type="default"
                  size="small"
                  onClick={() => handleViewBlog(record.id)}
                />
              </Tooltip>
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

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <Button
        type="primary"
        className="absolute top-6 right-6 bg-[#20558A]"
        onClick={() => setShowModal(true)}
      >
        Tạo blog mới
      </Button>

      {/* Thanh tìm kiếm */}
      <CustomSearch
        onSearch={(keyword) => {
          setCurrent(1);
          setSearchKeyword(keyword);
        }}
        className="mb-4"
        placeholder="Tìm kiếm theo tiêu đề blog"
        inputWidth="w-96"
      />

      <Table
        columns={columns}
        dataSource={blogs}
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
      >
        {selectedBlog && (
          <UpdateBlogForm blog={selectedBlog} onSuccess={handleBlogUpdated} />
        )}
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        title="Chi tiết blog"
        width={600}
      >
        {viewLoading ? (
          <div>Đang tải...</div>
        ) : viewingBlog ? (
          <div className="space-y-4">
            <div>
              <strong>Nội dung:</strong>
              <div style={{ whiteSpace: "pre-line" }}>
                {viewingBlog.content}
              </div>
            </div>
            <div>
              <strong>Ảnh:</strong>
              <div>
                {viewingBlog.blogImgUrl ? (
                  <Image
                    src={viewingBlog.blogImgUrl}
                    alt="blog"
                    width={120}
                    height={90}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </div>
            </div>
            <div>
              <strong>Người đăng:</strong>
              <div className="flex items-center gap-2">
                <img
                  src={viewingBlog.userAvatar || "/no-avatar.png"}
                  alt={viewingBlog.fullName || "Không rõ"}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span>{viewingBlog.fullName || "Không rõ"}</span>
              </div>
            </div>
            <div>
              <strong>Ngày tạo:</strong>
              <div>{helpers.formatDate(new Date(viewingBlog.createdAt))}</div>
            </div>
          </div>
        ) : (
          <div>Không tìm thấy blog.</div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBlogManager;
