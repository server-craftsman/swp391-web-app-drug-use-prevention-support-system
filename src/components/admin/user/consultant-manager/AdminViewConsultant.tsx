import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Avatar, Spin, message, Tag } from "antd";
import { ConsultantService } from "../../../../services/consultant/consultant.service";
import type { Consultant } from "../../../../types/consultant/consultant.res.type";

interface AdminViewConsultantProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

const AdminViewConsultant: React.FC<AdminViewConsultantProps> = ({
  id,
  open,
  onClose,
}) => {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && id) fetchData();
  }, [open, id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ConsultantService.getConsultantById({ id });
      if (res.data.success) {
        setConsultant(res.data.data);
      } else {
        message.error("Không thể tải thông tin tư vấn viên.");
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
      title="Chi tiết Tư vấn viên"
      width={700}
      centered
    >
      {loading ? (
        <Spin className="flex justify-center py-10" />
      ) : consultant ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Ảnh đại diện">
            <Avatar src={consultant.profilePicUrl} size={100} />
          </Descriptions.Item>
          <Descriptions.Item label="Họ và tên">
            {consultant.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {consultant.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {consultant.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Chức danh">
            {consultant.jobTitle}
          </Descriptions.Item>
          <Descriptions.Item label="Trình độ chuyên môn">
            {consultant.qualifications.join(", ")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày vào làm">
            {new Date(consultant.hireDate).toLocaleDateString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Mức lương">
            {consultant.salary.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={consultant.status === "Active" ? "green" : "red"}>
              {consultant.status === "Active"
                ? "Đang hoạt động"
                : "Ngừng hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(consultant.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(consultant.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không tìm thấy tư vấn viên.</p>
      )}
    </Modal>
  );
};

export default AdminViewConsultant;
