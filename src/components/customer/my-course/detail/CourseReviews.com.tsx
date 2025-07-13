import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Avatar,
  Rate,
  Button,
  Spin,
  Input,
  Form,
} from "antd";
import DeleteReview from "../../../client/review/DeleteReview.com";
import { useCreateReview } from "../../../../hooks/useReview";
import { UserService } from "../../../../services/user/user.service";

const { Title, Text, Paragraph } = Typography;

interface Review {
  id: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  timeAgo?: string;
  comment: string;
  avatarColor?: string;
  createdAt?: string;
  userId: string;
}

interface CourseReviewsProps {
  courseId: string;
  userId: string;
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
  loading: boolean;
  averageRating: number; // thêm dòng này
  onReviewChanged: () => void;
}

interface UserInfo {
  fullName: string;
  profilePicUrl?: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  courseId,
  userId,
  reviews = [],
  loading,
  onReviewChanged,
  averageRating,
  totalReviews,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const createReview = useCreateReview();

  // Map userId -> user info
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const ids = Array.from(new Set(reviews.map((r) => r.userId)));
      const newUserMap: Record<string, UserInfo> = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await UserService.getUserById({ userId: id });
            if (res.data?.success && res.data?.data) {
              newUserMap[id] = {
                fullName: res.data.data.fullName,
                profilePicUrl: res.data.data.profilePicUrl,
              };
            }
          } catch {}
        })
      );
      setUserMap(newUserMap);
    };
    if (reviews.length > 0) fetchUsers();
  }, [reviews]);

  const handleFinish = async (values: { rating: number; comment: string }) => {
    setSubmitting(true);
    try {
      await createReview.mutateAsync({
        courseId,
        userId,
        rating: values.rating,
        comment: values.comment,
      });
      form.resetFields();
      onReviewChanged();
    } catch (err) {
      // Thông báo lỗi đã được handle trong hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <div className="mb-6">
        <Title level={3} className="text-gray-900 mb-2">
          Tất cả đánh giá
        </Title>
        <div className="flex items-center mb-2 gap-4">
          <Rate
            disabled
            allowHalf
            value={averageRating}
            style={{ fontSize: 20 }}
          />
          <span className="font-semibold text-lg text-[#20558A]">
            {averageRating.toFixed(1)} / 5.0
          </span>
          <span className="text-gray-500 text-base">
            ({totalReviews} đánh giá)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-gray-500">
            Chưa có đánh giá nào cho khóa học này.
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={review.id}
              className={`border-b border-gray-200 pb-6 ${
                index === reviews.length - 1 ? "last:border-b-0" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar
                    size={40}
                    src={userMap[review.userId]?.profilePicUrl}
                    className={`${
                      review.avatarColor || "bg-blue-600"
                    } flex-shrink-0`}
                  >
                    {userMap[review.userId]?.fullName
                      ? userMap[review.userId].fullName
                          .split(" ")
                          .map((name: string) => name[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </Avatar>
                  <div>
                    <Text className="font-semibold text-gray-900 block">
                      {userMap[review.userId]?.fullName || "Người dùng"}
                    </Text>
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      className="text-yellow-400"
                      style={{ fontSize: "12px" }}
                    />
                    <Text className="text-gray-500 text-xs ml-2">
                      {review.timeAgo ||
                        (review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "")}
                    </Text>
                  </div>
                </div>
                {review.userId === userId && (
                  <DeleteReview
                    reviewId={review.id}
                    onDeleted={onReviewChanged}
                  />
                )}
              </div>
              <Paragraph className="text-gray-700 text-sm mb-3">
                {review.comment}
              </Paragraph>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">{loading ? <Spin /> : null}</div>
      {/* Form đánh giá */}
      {userId ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="mb-8"
        >
          <Form.Item
            name="rating"
            label="Đánh giá của bạn"
            rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhận xét của bạn về khóa học..."
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
            className="bg-blue-900 hover:bg-blue-700 text-white"
          >
            Gửi đánh giá
          </Button>
        </Form>
      ) : (
        <div className="mb-8 text-red-500">Bạn cần đăng nhập để đánh giá.</div>
      )}
    </Card>
  );
};

export default CourseReviews;
