import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Spin,
  Button,
  Typography,
  message,
  Card,
  Avatar,
  Rate,
} from "antd";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";
import { ReviewService } from "../../../services/review/review.service";
import { UserService } from "../../../services/user/user.service";
// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import MoreCourses from "./detail/MoreCourses.com.tsx";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // State cho user info
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});

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

  // Lấy thông tin user cho từng review
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
              <CourseInstructor instructorId={course.userId} />

              {/* Reviews Section - chỉ đọc */}
              <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <Typography.Title level={4} className="mb-4">
                  Đánh giá khóa học
                </Typography.Title>
                {loadingReviews ? (
                  <Spin />
                ) : reviews.length === 0 ? (
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
