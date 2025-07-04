import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Avatar, Spin, message } from "antd";
import type { UserResponse } from "../../../../types/user/User.res.type";
import { UserService } from "../../../../services/user/user.service";

interface AdminViewUserProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const AdminViewManager: React.FC<AdminViewUserProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [userId, open]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await UserService.getUserById({ userId });
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        message.error("Không thể tải thông tin người dùng.");
      }
    } catch (err) {
      message.error("Lỗi khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title="Thông tin người dùng"
      width={600}
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin />
        </div>
      ) : user ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Ảnh đại diện">
            <Avatar
              src={user.profilePicUrl}
              size={100}
              shape="circle"
              alt="avatar"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Họ và tên">
            {user.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {user.gender === "male"
              ? "Nam"
              : user.gender === "female"
              ? "Nữ"
              : "Khác"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {new Date(user.dob).toLocaleDateString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có dữ liệu người dùng.</p>
      )}
    </Modal>
  );
};

export default AdminViewManager;
