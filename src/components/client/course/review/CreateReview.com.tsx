import React from "react";
import { Button, Input, Rate, Form, message } from "antd";
import { useCreateReview } from "../../../../hooks/useReview";

interface CreateReviewProps {
  courseId: string;
  userId: string;
  onSuccess?: () => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({
  courseId,
  userId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const createReview = useCreateReview();

  const handleFinish = (values: { rating: number; comment: string }) => {
    createReview.mutate(
      {
        courseId,
        userId,
        rating: values.rating,
        comment: values.comment,
      },
      {
        onSuccess: () => {
          message.success("Đánh giá thành công!");
          form.resetFields();
          onSuccess?.();
        },
        onError: () => {
          message.error("Đánh giá thất bại!");
        },
      }
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="max-w-lg"
    >
      <Form.Item
        name="rating"
        label="Đánh giá"
        rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
      >
        <Rate />
      </Form.Item>
      <Form.Item
        name="comment"
        label="Nhận xét"
        rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
      >
        <Input.TextArea rows={3} placeholder="Nhận xét của bạn..." />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={createReview.isPending}
        >
          Gửi đánh giá
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateReview;
