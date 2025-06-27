import { useEffect, useState } from "react";
import { Table, Image, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserService } from "../../../services/user/user.service";
import type { GetUsers } from "../../../types/user/User.req.type";
import CustomPagination from "../../common/Pagiation.com";

interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  profilePicUrl: string;
  role: string;
}

const AdminUserManager = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    const params: GetUsers = {
      pageNumber: current,
      pageSize: pageSize,
    };

    try {
      const res = await UserService.getAllUsers(params);
      const data = res.data as any;
      setUsers(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách người dùng!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [current, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const columns: ColumnsType<UserResponse> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "profilePicUrl",
      key: "profilePicUrl",
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
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Quản lý Người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
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
    </div>
  );
};

export default AdminUserManager;
