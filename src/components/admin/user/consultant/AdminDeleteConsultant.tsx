import React from "react";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../../services/consultant/consultant.service";
import { UserService } from "../../../../services/user/user.service"; // ✅ Import thêm
import type { Consultant } from "../../../../types/consultant/consultant.res.type";

interface AdminDeleteConsultantProps {
  open: boolean;
  onClose: () => void;
  consultant: Consultant | null;
  onDeleted: () => void;
}

const AdminDeleteConsultant: React.FC<AdminDeleteConsultantProps> = ({
  open,
  onClose,
  consultant,
  onDeleted,
}) => {
  const handleDelete = async () => {
    if (!consultant) {
      message.error("Không tìm thấy chuyên viên tư vấn.");
      return;
    }

    try {
      // 🔥 Xoá chuyên viên
      await ConsultantService.deleteConsultant({ id: consultant.id });

      // 🔥 Xoá tài khoản user nếu có userId
      if (consultant.userId) {
        await UserService.deleteUser({ userId: consultant.userId });
      }

      message.success(`Đã xoá chuyên viên: ${consultant.fullName}`);
      onClose();
      onDeleted?.();
    } catch (error: any) {
      console.error("Delete consultant error:", error);
      message.error(
        error?.response?.data?.message || "Xoá chuyên viên tư vấn thất bại!"
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
          Xác nhận xoá chuyên viên tư vấn
        </span>
      }
    >
      {consultant ? (
        <p>
          Bạn có chắc muốn xoá chuyên viên{" "}
          <strong>{consultant.fullName}</strong> không?
        </p>
      ) : (
        <p>Không tìm thấy thông tin chuyên viên.</p>
      )}
    </Modal>
  );
};

export default AdminDeleteConsultant;
