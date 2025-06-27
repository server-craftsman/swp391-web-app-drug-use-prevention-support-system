import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Button, Typography } from "antd";
import type { Course } from "../../../types/course/Course.res.type";
import { CourseService } from "../../../services/course/course.service";

// Import detail components
import CourseHero from "./detail/CourseHero.com.tsx";
import CourseHighlights from "./detail/CourseHighlights.com.tsx";
import CourseContent from "./detail/CourseContent.com.tsx";
import CourseDescription from "./detail/CourseDescription.com.tsx";
import CourseInstructor from "./detail/CourseInstructor.com.tsx";
import CourseReviews from "./detail/CourseReviews.com.tsx";
import CoursePurchaseCard from "./detail/CoursePurchaseCard.com.tsx";
import MoreCourses from "./detail/MoreCourses.com.tsx";

const { Title } = Typography;

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (courseId) {
          const res = await CourseService.getCourseById({ id: courseId });
          if (res.data && res.data.success && res.data.data) {
            setCourse(res.data.data);
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

  // Sample data for components
  const courseHighlights = [
    "12 giờ video theo yêu cầu",
    "45 tài liệu có thể tải xuống", 
    "Truy cập trên thiết bị di động và TV",
    "Quyền truy cập đầy đủ suốt đời",
    "Giấy chứng nhận hoàn thành"
  ];

  const courseContent = [
    {
      title: "Chào mừng đến với khóa học Automation với n8n",
      duration: "1 phút",
      lessons: 1,
      expanded: true,
      lectures: [
        {
          title: "Giới thiệu về khóa học",
          duration: "00:36",
          preview: true,
          completed: false
        }
      ]
    },
    {
      title: "Giới thiệu về Automation, AI và n8n",
      duration: "21 phút",
      lessons: 6,
      expanded: false,
      lectures: [
        {
          title: "Chào mừng đến với Chương 1",
          duration: "00:33",
          preview: true,
          completed: false
        },
        {
          title: "Tìm hiểu về Automation",
          duration: "06:09",
          preview: true,
          completed: false
        },
        {
          title: "Tìm hiểu về AI và kết hợp AI với Automation",
          duration: "04:18",
          preview: true,
          completed: false
        },
        {
          title: "Giới thiệu về Low-Code, No-Code",
          duration: "04:05",
          preview: true,
          completed: false
        },
        {
          title: "Giới thiệu sơ bộ về n8n",
          duration: "05:48",
          preview: true,
          completed: false
        },
        {
          title: "Tổng kết Chương 1",
          duration: "00:22",
          preview: false,
          completed: false
        }
      ]
    },
    {
      title: "Tạo tài khoản, cài đặt n8n",
      duration: "38 phút",
      lessons: 9,
      expanded: false,
      lectures: []
    },
    {
      title: "Các loại Nodes trong n8n",
      duration: "41 phút", 
      lessons: 10,
      expanded: false,
      lectures: []
    },
    {
      title: "Credentials in n8n",
      duration: "34 phút",
      lessons: 7,
      expanded: false,
      lectures: []
    },
    {
      title: "Hands on #1",
      duration: "58 phút",
      lessons: 6,
      expanded: false,
      lectures: []
    },
    {
      title: "Các công cụ phụ trợ cho n8n",
      duration: "25 phút",
      lessons: 5,
      expanded: false,
      lectures: []
    },
    {
      title: "Các nodes liên quan đến AI",
      duration: "39 phút",
      lessons: 7,
      expanded: false,
      lectures: []
    },
    {
      title: "Hands on #2",
      duration: "40 phút",
      lessons: 5,
      expanded: false,
      lectures: []
    },
    {
      title: "Tổng kết khóa học",
      duration: "1 phút",
      lessons: 2,
      expanded: false,
      lectures: []
    }
  ];

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
                instructorName="Huy Nguyen"
                instructorTitle="Founder at M&A.vn"
              />

              {/* Reviews Section */}
              <CourseReviews />

              {/* More Courses Section */}
              <MoreCourses instructorName="Huy Nguyen" />
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
