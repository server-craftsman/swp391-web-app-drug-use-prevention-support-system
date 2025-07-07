import React, { useEffect, useState } from "react";
import { Table, message, Rate } from "antd";
import { ReviewService } from "../../../services/review/review.service";
import type { Review } from "../../../types/review/Review.res.type";
import DeleteReview from "./DeleteReview.com";

const PAGE_SIZE = 8;

const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  // Lấy userId từ localStorage
  let userId = "";
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id || "";
    } catch {
      userId = "";
    }
  }

  const fetchReviews = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await ReviewService.getReviewByUserId({ userId });
      const data = res.data?.data || [];
      setReviews(data);
      setTotal(data.length);
    } catch {
      message.error("Không thể tải đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [userId, current]);

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
      render: (_: any, record: Review) => record.courseId || record.courseId,
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Review) => (
        <DeleteReview reviewId={record.id} onDeleted={fetchReviews} />
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Đánh giá của tôi</h2>
      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current,
          pageSize: PAGE_SIZE,
          total,
          onChange: setCurrent,
        }}
      />
    </div>
  );
};

export default ReviewManager;
