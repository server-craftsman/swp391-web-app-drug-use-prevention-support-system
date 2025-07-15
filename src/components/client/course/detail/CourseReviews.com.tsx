import React from "react";
import { Card, Typography, Spin, Avatar, Rate } from "antd";

interface UserInfo {
  fullName: string;
  profilePicUrl?: string;
}

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface CourseReviewsProps {
  reviews: Review[];
  loading: boolean;
  userMap: Record<string, UserInfo>;
  totalReviews: number;
  averageRating: number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  reviews,
  loading,
  userMap,
  totalReviews,
  averageRating,
}) => (
  <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
    <Typography.Title level={4} className="mb-2">
      Đánh giá khóa học
    </Typography.Title>
    <div className="flex items-center mb-4 gap-4">
      <Rate disabled allowHalf value={averageRating} style={{ fontSize: 20 }} />
      <span className="font-semibold text-lg text-[#20558A]">
        {averageRating.toFixed(1)} / 5.0
      </span>
      <span className="text-gray-500 text-base">({totalReviews} đánh giá)</span>
    </div>
    {loading ? (
      <Spin />
    ) : !Array.isArray(reviews) || reviews.length === 0 ? (
      <div className="text-gray-500">
        Chưa có đánh giá nào cho khóa học này.
      </div>
    ) : (
      reviews.map((review, index) => (
        <div
          key={review.id}
          className={`border-b border-gray-200 pb-6 mb-4 ${
            index === reviews.length - 1 ? "last:border-b-0" : ""
          }`}
        >
          <div className="flex items-start space-x-3 mb-2">
            <Avatar
              size={40}
              src={userMap[review.userId]?.profilePicUrl}
              className="bg-blue-600 flex-shrink-0"
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
              <Typography.Text className="font-semibold text-gray-900 block">
                {userMap[review.userId]?.fullName || "Người dùng"}
              </Typography.Text>
              <Rate
                disabled
                defaultValue={review.rating}
                className="text-yellow-400"
                style={{ fontSize: "12px" }}
              />
              <Typography.Text className="text-gray-500 text-xs ml-2">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : ""}
              </Typography.Text>
            </div>
          </div>
          <Typography.Paragraph className="text-gray-700 text-sm mb-0">
            {review.comment}
          </Typography.Paragraph>
        </div>
      ))
    )}
  </Card>
);

export default CourseReviews;
