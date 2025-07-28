import { useEffect, useState } from "react";
import { Table, Image, message, Button, Space, Tag, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";
import CustomPagination from "../../../common/Pagiation.com";
import CustomSearch from "../../../common/CustomSearch.com"; // ✅ Thêm dòng này
import AdminCreateManagerForm from "./AdminCreateManager";
import AdminDeleteManager from "./AdminDeleteManager";
import AdminViewManager from "./AdminViewManager";

const AdminManagerManager = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ Thêm state tìm kiếm

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAllUsers({
        pageNumber: 1,
        pageSize: 1000,
      });
      const data = res.data as any;

      if (!Array.isArray(data?.data)) {
        throw new Error("Invalid data format from API");
      }

      let allManagers = data.data.filter(
        (user: UserResponse) => user.role?.toLowerCase() === "manager"
      );

      // ✅ Lọc theo tên nếu có keyword
      if (searchKeyword.trim()) {
        allManagers = allManagers.filter((user: UserResponse) =>
          user.fullName?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      const startIdx = (current - 1) * pageSize;
      const endIdx = current * pageSize;
      const paginatedManagers = allManagers.slice(startIdx, endIdx);

      setUsers(paginatedManagers);
      setTotal(allManagers.length);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách quản lý viên!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [current, pageSize, searchKeyword]); // ✅ Thêm searchKeyword vào dependency

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: UserResponse) => {
    setViewUserId(record.id); // ✅ Lưu ID
    setViewModalOpen(true); // ✅ Mở modal
  };
  const handleDelete = (record: UserResponse) => {
    setSelectedUser(record);
    setDeleteModalOpen(true);
  };

  const columns: ColumnsType<UserResponse> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "profilePicUrl",
      key: "profilePicUrl",
      width: 80,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="avatar"
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">No img</span>
          </div>
        ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const g = gender?.toLowerCase();
        return (
          <Tag color={g === "male" ? "blue" : "pink"}>
            {g === "male" ? "Nam" : "Nữ"}
          </Tag>
        );
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="red">Quản lý</Tag>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record: UserResponse) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="Xoá"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý Quản lý viên
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý danh sách quản lý viên trong hệ thống
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-[#20558A]"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm quản lý viên mới
        </Button>
      </div>

      {/* ✅ Thanh tìm kiếm */}
      <CustomSearch
        onSearch={(keyword) => {
          setCurrent(1);
          setSearchKeyword(keyword);
        }}
        className="mb-4"
        placeholder="Tìm kiếm quản lý viên theo tên"
        inputWidth="w-96"
      />

      <div className="mb-4">
        <Tag color="red">Tổng cộng: {total} quản lý viên</Tag>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        className="mb-4"
      />

      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      {/* Modal xoá */}
      <AdminDeleteManager
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={selectedUser}
        onDeleted={fetchManagers}
      />

      {/* Modal tạo mới */}
      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        width={700}
      >
        <AdminCreateManagerForm
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchManagers();
          }}
        />
      </Modal>
      {viewUserId && (
        <AdminViewManager
          userId={viewUserId}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setViewUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminManagerManager;
