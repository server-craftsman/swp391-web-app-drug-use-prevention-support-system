import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography, message } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
import { ReviewService } from "../../../services/review/review.service";
import CourseHero from "./detail/CourseHero.com";
import CourseHighlights from "./detail/CourseHighlights.com";
import CourseContent from "./detail/CourseContent.com";
import CourseDescription from "./detail/CourseDescription.com";
import CourseInstructor from "./detail/CourseInstructor.com";
import MoreCourses from "./detail/MoreCourses.com";
import CourseReviews from "./detail/CourseReviews.com";

const { Title } = Typography;

const MyCourseDetail: React.FC = () => {
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
        message.error("Không thể tải chi tiết khóa học!");
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
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const handleReviewChanged = () => {
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

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

  const courseHighlights = [
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành",
  ];

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

  const instructorName = "Huy Nguyễn";
  const instructorTitle = "Giảng viên khóa học";

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[32, 32]}>
          {/* Left Content */}
          <Col xs={24} lg={16}>
            <div className="space-y-8">
              <CourseHighlights highlights={courseHighlights} />
              <CourseContent content={courseContent} />
              <CourseDescription course={course} />
              <CourseInstructor
                instructorName={instructorName}
                instructorTitle={instructorTitle}
              />

              {/* Reviews Section - cho phép tạo, xóa */}
              <CourseReviews
                courseId={course.id}
                userId={userId}
                reviews={reviews}
                loading={loadingReviews}
                onReviewChanged={handleReviewChanged}
              />

              <MoreCourses instructorName={instructorName} />
            </div>
          </Col>

          {/* Right Sidebar - Custom đẹp hơn */}
          <Col xs={0} lg={8}>
            <div
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center"
              style={{
                minHeight: 260,
                border: "1px solid #e6eaf0",
                boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.08)",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="success"
                style={{ width: 64, marginBottom: 16 }}
              />
              <Title level={4} style={{ color: "#20558A", marginBottom: 8 }}>
                Chúc bạn học tốt!
              </Title>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MyCourseDetail;
