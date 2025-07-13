import React, { useEffect } from "react";
import { Modal, Form, Rate, Input } from "antd";
import { useUpdateReview } from "../../../hooks/useReview";
import type { Review } from "../../../types/review/Review.res.type";

interface UpdateReviewProps {
  open: boolean;
  onClose: () => void;
  review: Review | null;
  onSuccess?: () => void;
}

const UpdateReview: React.FC<UpdateReviewProps> = ({
  open,
  onClose,
  review,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const updateReviewMutation = useUpdateReview();

  useEffect(() => {
    if (review) {
      form.setFieldsValue({
        rating: review.rating,
        comment: review.comment,
      });
    } else {
      form.resetFields();
    }
  }, [review, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateReviewMutation.mutateAsync({
        id: review?.id!,
        rating: values.rating,
        comment: values.comment,
      });
      onClose();
      onSuccess?.();
    } catch {
      // validation error
    }
  };

  return (
    <Modal
      open={open}
      title="Cập nhật đánh giá"
      onCancel={onClose}
      onOk={handleOk}
      okText="Cập nhật"
      confirmLoading={updateReviewMutation.isPending}
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Số sao"
          name="rating"
          rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          label="Bình luận"
          name="comment"
          rules={[
            { required: true, message: "Vui lòng nhập bình luận!" },
            { max: 500, message: "Tối đa 500 ký tự!" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập bình luận..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateReview;
