// CourseDetail.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseData from "../../../data/course.json";
import type { Course } from "../../../types/course/Course.type";
import { Button, Typography, Row, Col } from "antd";
import CourseInfoCard from "./CourseInfoCard.com";
import CourseMediaCard from "./CourseMediaCard.com";

const { Title } = Typography;
const typedCourseData = courseData as Course[];

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = typedCourseData.find((c) => c.id === Number(courseId));

  if (!course) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Title level={3}>Không tìm thấy khóa học</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
      <Row gutter={[32, 32]}>
        {/* Bên trái - hình + mô tả */}
        <Col xs={24} md={14}>
          <CourseMediaCard course={course} />
        </Col>

        {/* Bên phải - tên + giá + button */}
        <Col xs={24} md={10}>
          <CourseInfoCard course={course} />
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetail;
