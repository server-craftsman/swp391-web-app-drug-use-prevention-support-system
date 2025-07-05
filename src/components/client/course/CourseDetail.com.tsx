import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography, message } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
import { ReviewService } from "../../../services/review/review.service";
// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import MoreCourses from "./detail/MoreCourses.com.tsx";
import CreateReview from "./review/CreateReview.com";
import DeleteReview from "./review/DeleteReview.com";

const { Title } = Typography;

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho review
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Lấy userId từ localStorage userInfo
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

  // Lấy course
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (courseId) {
          const res = await CourseService.getCourseById({ id: courseId });
          if (res.data && res.data.success && res.data.data) {
            setCourse(res.data.data as CourseDetailResponse);
          } else {
            setCourse(null);
          }
        }
      } catch (err) {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Lấy review theo courseId
  const fetchReviews = async () => {
    if (!courseId) return;
    setLoadingReviews(true);
    try {
      const res = await ReviewService.getReviewByCourseId({ courseId });
      setReviews(res.data?.data || []);
    } catch (err) {
      message.error("Không thể tải đánh giá!");
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
    // eslint-disable-next-line
  }, [courseId]);

  // Hàm refetch review sau khi thêm/xóa
  const handleReviewChanged = () => {
    fetchReviews();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Title level={3}>Không tìm thấy khóa học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  // Highlights từ data thật
  const courseHighlights = [
    `${course.videoUrls?.length || 0} video`,
    `${course.imageUrls?.length || 0} tài liệu`,
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành",
  ];

  // Content từ sessionList
  const courseContent =
    course.sessionList?.map((session) => ({
      title: session.name,
      duration: "",
      lessons: session.lessonList?.length || 0,
      expanded: false,
      lectures:
        session.lessonList?.map((lesson) => ({
          title: lesson.name,
          duration: lesson.fullTime ? `${lesson.fullTime} phút` : "",
          preview: false,
          completed: false,
          imageUrl: lesson.imageUrl || undefined,
          videoUrl: lesson.videoUrl || undefined,
        })) || [],
    })) || [];

  const instructorName = course.name || "Giảng viên";
  const instructorTitle = course.name || "Giảng viên khóa học";

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Left Content */}
          <Col xs={24} lg={16}>
            <div className="space-y-8">
              {/* What you'll learn */}
              <CourseHighlights highlights={courseHighlights} />

              {/* Course Content */}
              <CourseContent content={courseContent} />

              {/* Description */}
              <CourseDescription course={course} />

              {/* Instructor Section */}
              <CourseInstructor
                instructorName={instructorName}
                instructorTitle={instructorTitle}
              />

              {/* Reviews Section */}
              <div>
                <Typography.Title level={4}>Đánh giá khóa học</Typography.Title>
                {!userId && (
                  <div className="text-red-500 mb-4">
                    Bạn cần đăng nhập để đánh giá.
                  </div>
                )}
                {userId && (
                  <CreateReview
                    courseId={course.id}
                    userId={userId}
                    onSuccess={handleReviewChanged}
                  />
                )}
                <div className="mt-6">
                  {loadingReviews ? (
                    <Spin />
                  ) : reviews.length === 0 ? (
                    <div>Chưa có đánh giá nào cho khóa học này.</div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="mb-4 border-b pb-2 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold">
                            Người dùng: {review.userId}
                          </div>
                          <div>Đánh giá: {review.rating} ⭐</div>
                          <div>{review.comment}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleString()}
                          </div>
                        </div>
                        {review.userId === userId && (
                          <DeleteReview
                            reviewId={review.id}
                            onDeleted={handleReviewChanged}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* More Courses Section */}
              <MoreCourses instructorName={instructorName} />
            </div>
          </Col>

          {/* Right Sidebar - Sticky Purchase Card */}
          <Col xs={0} lg={8}>
            <CoursePurchaseCard course={course} highlights={courseHighlights} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseDetail;
