import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography, message } from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
import { ReviewService } from "../../../services/review/review.service";
import { UserService } from "../../../services/user/user.service";
import type { Review } from "../../../types/review/Review.res.type";
// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import MoreCourses from "./detail/MoreCourses.com.tsx";
import CourseReviews from "./detail/CourseReviews.com.tsx";
import MyCourseDetail from "../../customer/my-course/MyCourseDetail.com.tsx";

const { Title } = Typography;

interface UserInfo {
  fullName: string;
  profilePicUrl?: string;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho review
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // State cho user info
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});

  // Lấy userId từ localStorage (nên lấy từ object userInfo nếu có)
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo.id || localStorage.getItem("userId");

  // Lấy course
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (courseId) {
          // Truyền thêm userId vào request để API trả về isPurchased đúng cho user hiện tại
          const res = await CourseService.getCourseById({
            id: courseId,
            userId: userId ? userId : undefined,
          });
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
  }, [courseId, userId]);

  // Lấy review theo courseId
  const fetchReviews = async () => {
    if (!courseId) return;
    setLoadingReviews(true);
    try {
      const res = await ReviewService.getReviewByCourseId({ courseId });
      const pageInfo = res.data?.data;
      setReviews(Array.isArray(pageInfo?.reviews) ? pageInfo.reviews : []);
      setTotalReviews(pageInfo?.totalReviews || 0);
      setAverageRating(pageInfo?.averageRating || 0);
    } catch (err) {
      message.error("Không thể tải đánh giá!");
      setReviews([]);
      setTotalReviews(0);
      setAverageRating(0);
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

  // Lấy thông tin user cho từng review
  useEffect(() => {
    const fetchUsers = async () => {
      // Lấy danh sách userId duy nhất từ reviews
      const ids = Array.from(new Set(reviews.map((r) => r.userId)));
      // Chỉ lấy những userId chưa có trong userMap
      const missingIds = ids.filter((id) => !(id in userMap));
      if (missingIds.length === 0) return;

      const newUserMap: Record<string, UserInfo> = { ...userMap };
      await Promise.all(
        missingIds.map(async (id) => {
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
    if (Array.isArray(reviews) && reviews.length > 0) fetchUsers();
    // eslint-disable-next-line
  }, [reviews]);

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

  // Nếu đã mua thì render MyCourseDetail, chưa mua thì render giao diện cũ
  if (course.isPurchased) {
    return <MyCourseDetail course={course} />;
  }

  // Highlights từ data thật
  const courseHighlights = [
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

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <CourseHero course={course} averageRating={averageRating} />

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
              <CourseInstructor instructorId={course.userId} />

              {/* Reviews Section */}
              <CourseReviews
                reviews={reviews}
                loading={loadingReviews}
                userMap={userMap}
                totalReviews={totalReviews}
                averageRating={averageRating}
              />

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
