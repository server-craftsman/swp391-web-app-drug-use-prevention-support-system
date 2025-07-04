import React from "react";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";

interface AdminDeleteManagerProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onDeleted: () => void;
}

const AdminDeleteManager: React.FC<AdminDeleteManagerProps> = ({
  open,
  onClose,
  user,
  onDeleted,
}) => {
  const handleDelete = async () => {
    if (!user) {
      message.error("Không tìm thấy thông tin quản lý viên.");
      return;
    }

    try {
      await UserService.deleteUser({ userId: user.id });
      message.success(
        `Đã xoá quản lý viên: ${user.lastName} ${user.firstName}`
      );
      onClose();
      onDeleted?.();
    } catch (error: any) {
      console.error("Delete manager error:", error);
      message.error(
        error?.response?.data?.message || "Xoá quản lý viên thất bại!"
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
          Xác nhận xoá quản lý viên
        </span>
      }
    >
      {user ? (
        <p>
          Bạn có chắc chắn muốn xoá quản lý viên{" "}
          <strong>
            {user.lastName} {user.firstName}
          </strong>{" "}
          không?
        </p>
      ) : (
        <p>Không tìm thấy thông tin quản lý viên.</p>
      )}
    </Modal>
  );
};

export default AdminDeleteManager;
