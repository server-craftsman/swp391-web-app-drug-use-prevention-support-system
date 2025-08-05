import React from "react";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../../services/consultant/consultant.service";
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
      // Lấy toàn bộ consultant (hoặc nếu backend hỗ trợ filter theo userId thì truyền userId)
      const res = await ConsultantService.getAllConsultants({
        PageNumber: 1,
        PageSize: 10, // hoặc số lớn hơn tổng số consultant
      });
      // Tìm consultant có userId === consultant.id (id ở đây là userId)
      const consultantData = res.data?.data?.find(
        (c) => c.userId === consultant.id
      );

      if (consultantData) {
        await ConsultantService.deleteConsultant({ id: consultantData.id });
        message.success(`Đã xoá chuyên viên: ${consultant.fullName}`);
        onClose();
        onDeleted?.();
      } else {
        message.error("Không tìm thấy consultant tương ứng với user này!");
      }
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
