import React from "react";
import { Button, Popconfirm, message } from "antd";
import { ReviewService } from "../../../../services/review/review.service";

interface DeleteReviewProps {
  reviewId: string;
  onDeleted?: () => void;
}

const DeleteReview: React.FC<DeleteReviewProps> = ({ reviewId, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await ReviewService.deleteReview({ id: reviewId });
      message.success("Xóa đánh giá thành công!");
      onDeleted?.();
    } catch (error) {
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
      <Button danger size="small">
        Xóa
      </Button>
    </Popconfirm>
  );
};

export default DeleteReview;
