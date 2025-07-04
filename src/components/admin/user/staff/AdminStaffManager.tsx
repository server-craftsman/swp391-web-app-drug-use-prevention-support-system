import { useEffect, useState } from "react";
import { Table, Image, message, Button, Space, Tag, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";
import CustomPagination from "../../../common/Pagiation.com";
import CustomSearch from "../../../common/CustomSearch.com"; // ✅ Thêm dòng này
import AdminCreateStaffForm from "./AdminCreateStaff";
import AdminDeleteStaff from "./AdminDeleteStaff";
import AdminViewStaff from "./AdminViewStaff";

const AdminStaffManager = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ Thêm state tìm kiếm

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchStaff = async () => {
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

      let allStaff = data.data.filter(
        (user: UserResponse) => user.role?.toLowerCase() === "staff"
      );

      // ✅ Lọc theo từ khóa tìm kiếm
      if (searchKeyword.trim()) {
        allStaff = allStaff.filter((user: UserResponse) =>
          user.fullName?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      const startIdx = (current - 1) * pageSize;
      const endIdx = current * pageSize;
      const paginatedStaff = allStaff.slice(startIdx, endIdx);

      setUsers(paginatedStaff);
      setTotal(allStaff.length);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách nhân viên!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [current, pageSize, searchKeyword]); // ✅ thêm searchKeyword

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: UserResponse) => {
    setViewUserId(record.id);
    setViewModalOpen(true);
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
      render: () => <Tag color="green">Nhân viên</Tag>,
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
            Quản lý Nhân viên
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý đội ngũ nhân viên trong hệ thống
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-[#20558A]"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm nhân viên mới
        </Button>
      </div>

      {/* ✅ Thanh tìm kiếm */}
      <CustomSearch
        onSearch={(keyword) => {
          setCurrent(1); // reset về trang đầu
          setSearchKeyword(keyword);
        }}
        className="mb-4"
        placeholder="Tìm kiếm nhân viên theo tên"
        inputWidth="w-96"
      />

      <div className="mb-4">
        <Tag color="green">Tổng cộng: {total} nhân viên</Tag>
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
      <AdminDeleteStaff
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={selectedUser}
        onDeleted={fetchStaff}
      />

      {/* Modal tạo mới */}
      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        title="Thêm nhân viên mới"
        width={700}
      >
        <AdminCreateStaffForm
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchStaff();
          }}
        />
      </Modal>
      {viewUserId && (
        <AdminViewStaff
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

export default AdminStaffManager;
