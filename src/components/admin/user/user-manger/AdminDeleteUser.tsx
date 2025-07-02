import React from "react";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";

interface AdminDeleteUserProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onDeleted: () => void;
}

const AdminDeleteUser: React.FC<AdminDeleteUserProps> = ({
  open,
  onClose,
  user,
  onDeleted,
}) => {
  const handleDelete = async () => {
    if (!user) {
      message.error("Không tìm thấy thông tin khách hàng.");
      return;
    }

    try {
      await UserService.deleteUser({ userId: user.id });
      message.success(`Đã xoá khách hàng: ${user.lastName} ${user.firstName}`);
      onClose();
      onDeleted?.();
    } catch (error: any) {
      console.error("Delete user error:", error);
      message.error(
        error?.response?.data?.message || "Xoá khách hàng thất bại!"
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Xác nhận xoá"
      okType="danger"
      cancelText="Huỷ"
      title={
        <span className="text-red-600">
          <ExclamationCircleOutlined className="mr-2" />
          Xác nhận xoá khách hàng
        </span>
      }
    >
      {user ? (
        <p>
          Bạn có chắc chắn muốn xoá khách hàng{" "}
          <strong>
            {user.lastName} {user.firstName}
          </strong>{" "}
          không?
        </p>
      ) : (
        <p>Không tìm thấy thông tin khách hàng.</p>
      )}
    </Modal>
  );
};

export default AdminDeleteUser;
