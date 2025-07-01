import { useEffect, useState } from "react";
import { Table, Image, message, Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserService } from "../../../../services/user/user.service";
import type { GetUsers } from "../../../../types/user/User.req.type";
import CustomPagination from "../../../common/Pagiation.com";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { UserResponse } from "../../../../types/user/User.res.type";

const AdminConsultantManager = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const fetchConsultants = async () => {
    setLoading(true);
    const params: GetUsers = {
      pageNumber: current,
      pageSize: pageSize,
    };

    try {
      const res = await UserService.getAllUsers(params);
      const data = res.data as any;
      // Filter for consultant role on the frontend
      const consultantUsers = Array.isArray(data?.data)
        ? data.data.filter((user: UserResponse) => user.role === "Consultant")
        : [];
      setUsers(consultantUsers);
      setTotal(consultantUsers.length);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách tư vấn viên!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, [current, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: UserResponse) => {
    // TODO: Implement view functionality
    message.info(
      `Xem chi tiết tư vấn viên: ${record.lastName} ${record.firstName}`
    );
  };

  const handleEdit = (record: UserResponse) => {
    // TODO: Implement edit functionality
    message.info(
      `Chỉnh sửa tư vấn viên: ${record.lastName} ${record.firstName}`
    );
  };

  const handleDelete = (record: UserResponse) => {
    // TODO: Implement delete functionality
    message.warning(`Xóa tư vấn viên: ${record.lastName} ${record.firstName}`);
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
      render: (gender: string) => (
        <Tag color={gender === "MALE" ? "blue" : "pink"}>
          {gender === "MALE" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="purple">Tư vấn viên</Tag>,
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
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="Xóa"
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
            Quản lý Tư vấn viên
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý đội ngũ tư vấn viên hệ thống
          </p>
        </div>
        <Button type="primary" size="large">
          Thêm tư vấn viên mới
        </Button>
      </div>

      <div className="mb-4">
        <Tag color="purple">Tổng cộng: {total} tư vấn viên</Tag>
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
    </div>
  );
};

export default AdminConsultantManager;
