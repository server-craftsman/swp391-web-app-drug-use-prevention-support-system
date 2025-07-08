import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { ReviewService } from "../../../../services/review/review.service";

interface DeleteReviewProps {
  reviewId: string;
  onDeleted?: () => void;
}

const DeleteReview: React.FC<DeleteReviewProps> = ({ reviewId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ReviewService.deleteReview({ id: reviewId });
      message.success("Xóa đánh giá thành công!");
      onDeleted?.();
    } catch (error) {
      message.error("Xóa đánh giá thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa đánh giá này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ loading }}
    >
      <Button danger size="small" loading={loading}>
        Xóa
      </Button>
    </Popconfirm>
  );
};

export default DeleteReview;
