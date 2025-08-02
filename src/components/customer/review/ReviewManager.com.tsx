import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Rate,
  Button,
  Modal,
  Spin,
  Tooltip,
  Select,
  Typography,
} from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ReviewService } from "../../../services/review/review.service";
import { CourseService } from "../../../services/course/course.service";
import type { Review } from "../../../types/review/Review.res.type";
import DeleteReview from "../../client/review/DeleteReview.com";
import CustomSearch from "../../common/CustomSearch.com";
import { formatDate } from "../../../utils/helper";
import UpdateReview from "../../client/review/UpdateReview.com";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";

const PAGE_SIZE = 8;

const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});
  const [viewModal, setViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailResponse | null>(null);

  // State cho update review
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedUpdateReview, setSelectedUpdateReview] =
    useState<Review | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | undefined>(undefined);

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
      let data = res.data?.data || [];
      // Filter theo tên khóa học hoặc số sao
      if (search) {
        data = data.filter((r: any) =>
          (courseMap[r.courseId] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      }
      if (starFilter) {
        data = data.filter((r: any) => r.rating === starFilter);
      }
      setReviews(data);
      setTotal(data.length);

      // Lấy tên khóa học cho từng review
      const ids = Array.from(new Set(data.map((r: any) => r.courseId)));
      const newCourseMap: Record<string, string> = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await CourseService.getCourseById({ id });
            if (res.data?.success && res.data?.data) {
              newCourseMap[id] = res.data.data.name || id;
            }
          } catch {
            newCourseMap[id] = id;
          }
        })
      );
      setCourseMap((prev) => ({ ...prev, ...newCourseMap }));
    } catch {
      message.error("Không thể tải đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [userId, current, search, starFilter]);

  // Hàm xử lý View
  const handleView = async (reviewId: string) => {
    setViewLoading(true);
    setViewModal(true);
    try {
      const res = await ReviewService.getReviewById({ id: reviewId });
      if (res.data?.success && res.data?.data) {
        setSelectedReview(res.data.data);
        // Lấy thông tin khóa học chi tiết
        const courseRes = await CourseService.getCourseById({ id: res.data.data.courseId });
        if (courseRes.data?.success && courseRes.data?.data) {
          setSelectedCourse(courseRes.data.data);
        } else {
          setSelectedCourse(null);
        }
      } else {
        setSelectedReview(null);
        setSelectedCourse(null);
        message.error("Không tìm thấy đánh giá!");
      }
    } catch {
      setSelectedReview(null);
      setSelectedCourse(null);
      message.error("Không thể tải chi tiết đánh giá!");
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "courseId",
      key: "courseId",
      align: "center" as const,
      render: (courseId: string) => (
        <span style={{ fontWeight: 500 }}>
          {courseMap[courseId] || courseId}
        </span>
      ),
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      align: "center" as const,
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      align: "center" as const,
      render: (comment: string) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, tooltip: comment.length > 60 }}
          style={{
            margin: 0,
            fontStyle: "italic",
            color: "#555",
            fontSize: 14,
            fontWeight: 500,
            maxWidth: 350,
          }}
        >
          {comment}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      render: (date: string) => formatDate(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: Review) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              size="small"
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              size="small"
              onClick={() => {
                setSelectedUpdateReview(record);
                setUpdateModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteReview
              reviewId={record.id}
              onDeleted={fetchReviews}
              buttonProps={{
                icon: <DeleteOutlined />,
                shape: "circle",
                danger: true,
                size: "small",
                style: { borderColor: "#ff4d4f", color: "#ff4d4f" },
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#f5f6fa",
        padding: 32,
        width: "100%",
        boxSizing: "border-box",
        paddingBottom: 48,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          Đánh giá của tôi
        </h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <CustomSearch
          placeholder="Tìm kiếm theo tên khóa học"
          onSearch={setSearch}
          loading={loading}
          inputWidth="w-64"
        />
        <Select
          allowClear
          placeholder="Lọc theo số sao"
          style={{ width: 180 }}
          value={starFilter}
          onChange={(val) => setStarFilter(val)}
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <Select.Option key={star} value={star}>
              <Rate disabled value={star} /> {star} sao
            </Select.Option>
          ))}
        </Select>
        <Button
          onClick={() => {
            setSearch("");
            setStarFilter(undefined);
          }}
        >
          Xóa lọc
        </Button>
      </div>
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
        bordered
        size="middle"
        scroll={{ x: 900 }}
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: 0,
          minWidth: 900,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        open={viewModal}
        title={
          <span style={{ fontSize: 22, fontWeight: 600 }}>
            Thông tin đánh giá
          </span>
        }
        onCancel={() => setViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewModal(false)} size="large">
            Đóng
          </Button>,
        ]}
        width={500}
        style={{ top: 40 }}
        bodyStyle={{
          padding: 32,
          background: "#fff",
          borderRadius: 12,
        }}
        centered
      >
        {viewLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 80,
            }}
          >
            <Spin />
          </div>
        ) : selectedReview ? (
          <div style={{ fontSize: 16 }}>
            {/* Thông tin khóa học */}
            {selectedCourse && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  {selectedCourse.imageUrls && selectedCourse.imageUrls.length > 0 && (
                    <img
                      src={selectedCourse.imageUrls[0]}
                      alt={selectedCourse.name}
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        background: "#fafafa",
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#20558A" }}>
                      {selectedCourse.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#888" }}>
                      Ngày tạo: {selectedCourse.createdAt ? formatDate(new Date(selectedCourse.createdAt)) : ""}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                  <b>Mức độ rủi ro:</b>{" "}
                  <span style={{
                    color:
                      selectedCourse.riskLevel === "High"
                        ? "#ff4d4f"
                        : selectedCourse.riskLevel === "Medium"
                        ? "#faad14"
                        : "#52c41a",
                    fontWeight: 600,
                  }}>
                    {selectedCourse.riskLevel === "High"
                      ? "Cao"
                      : selectedCourse.riskLevel === "Medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                  <b>Đối tượng:</b> {selectedCourse.targetAudience}
                </div>
                <div style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                  <b>Mô tả:</b>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedCourse.content?.length > 120
                          ? selectedCourse.content.slice(0, 120) + "..."
                          : selectedCourse.content,
                    }}
                  />
                </div>
              </div>
            )}
            {/* Thông tin đánh giá */}
            <div style={{ marginBottom: 10 }}>
              <b>Số sao:</b> <Rate disabled value={selectedReview.rating} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Bình luận:</b> {selectedReview.comment}
            </div>
            <div>
              <b>Ngày đánh giá:</b>{" "}
              {selectedReview.createdAt
                ? formatDate(new Date(selectedReview.createdAt))
                : ""}
            </div>
          </div>
        ) : (
          <div>Không tìm thấy dữ liệu đánh giá.</div>
        )}
      </Modal>

      {/* Modal cập nhật đánh giá */}
      <UpdateReview
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        review={selectedUpdateReview}
        onSuccess={() => {
          setUpdateModal(false);
          fetchReviews();
        }}
      />
    </div>
  );
};

export default ReviewManager;
