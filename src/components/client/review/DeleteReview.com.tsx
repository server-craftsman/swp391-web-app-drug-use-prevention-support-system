import React from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ReviewService } from "../../../services/review/review.service";

interface DeleteReviewProps {
  reviewId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteReview: React.FC<DeleteReviewProps> = ({
  reviewId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      await ReviewService.deleteReview({ id: reviewId });
      message.success("Xóa đánh giá thành công!");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa đánh giá thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa đánh giá này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button icon={<DeleteOutlined />} danger size="small" {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteReview;
