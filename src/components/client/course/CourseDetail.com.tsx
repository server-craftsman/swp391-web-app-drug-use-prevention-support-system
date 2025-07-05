import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
// import { useQueryClient } from "@tanstack/react-query";

// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
// import CourseReviews from "./detail/CourseReviews.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import MoreCourses from "./detail/MoreCourses.com.tsx";

// Import hook lấy review
// import { useCourseReviews } from "../../../hooks/useReview";
// import CreateReview from "./review/CreateReview.com";
// import DeleteReview from "./review/DeleteReview.com";

const { Title } = Typography;

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  // // Lấy review theo courseId (nếu đã có course)
  // const { data: reviews = [], isLoading: loadingReviews } = useCourseReviews(
  //   course?.id
  // );

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

  // Instructor info (giả sử có trường fullName và instructorTitle)
  const instructorName = course.name || "Giảng viên";
  const instructorTitle = course.name || "Giảng viên khóa học";

  // Lấy userId từ localStorage userInfo (không dùng regex)
  // const userInfoStr = localStorage.getItem("userInfo");
  // if (userInfoStr) {
  //   try {
  //     const userInfo = JSON.parse(userInfoStr);
  //     userId = userInfo.id || "";
  //   } catch {
  //     userId = "";
  //   }
  // }

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
              {/* {/* Reviews Section */}
              {/*   <div>
                <Typography.Title level={4}>Đánh giá khóa học</Typography.Title>
                {/* Nếu chưa đăng nhập, báo lỗi */}
              {/*{!userId && (
                  <div className="text-red-500 mb-4">
                    Bạn cần đăng nhập để đánh giá.
                  </div>
                )}
                {/* Nếu đã đăng nhập, hiển thị form đánh giá */}
              {/* {userId && (
                  <CreateReview
                    courseId={course.id}
                    userId={userId}
                    onSuccess={() => {
                      // Refetch lại review sau khi tạo mới
                      queryClient.invalidateQueries({
                        queryKey: ["reviews", course.id],
                      });
                    }}
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
                        {/* Chỉ cho phép xóa nếu là review của user hiện tại */}
              {/*     {review.userId === userId && (
                          <DeleteReview
                            reviewId={review.id}
                            onDeleted={() => {
                              // Refetch lại review sau khi xóa
                              // Nếu dùng react-query thì gọi queryClient.invalidateQueries(["reviews", course.id])
                            }}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div> */}

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
