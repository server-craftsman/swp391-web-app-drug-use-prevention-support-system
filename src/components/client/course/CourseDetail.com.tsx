import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Course } from "../../../types/course/Course.res.type";
import { Button, Typography, Row, Col, Spin } from "antd";
import CourseInfoCard from "./CourseInfoCard.com";
import CourseMediaCard from "./CourseMediaCard.com";
import { CourseService } from "../../../services/course/course.service";

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
          // Lấy đúng object Course từ response
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Title level={3}>Không tìm thấy khóa học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  // Đảm bảo các trường không bị null khi truyền xuống component con
  const safeCourse: Course = {
    ...course,
    categoryId: course.categoryId ?? "",
    userId: course.userId ?? "",
    slug: course.slug ?? "",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "5px auto", padding: "0 20px" }}>
      <Row gutter={[32, 32]}>
        {/* Bên trái - hình + mô tả */}
        <Col xs={24} md={14}>
          <CourseMediaCard course={safeCourse} />
        </Col>
        {/* Bên phải - tên + giá + button */}
        <Col xs={24} md={10}>
          <CourseInfoCard course={safeCourse} />
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetail;
