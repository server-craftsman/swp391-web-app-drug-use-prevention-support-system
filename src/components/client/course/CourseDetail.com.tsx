// CourseDetail.com.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseData from "../../../data/course.json";
import type { Course } from "../../../types/course/CourseModel";
import { Button } from "antd";

const typedCourseData = courseData as Course[];

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = typedCourseData.find((c) => c.id === Number(courseId));

  if (!course) return <div>Không tìm thấy khóa học</div>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      <h1>{course.name}</h1>
      <img
        src={course.imageUrl}
        alt={course.name}
        style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
      />
      <p>
        <strong>Giá:</strong> ${course.price}
      </p>
      <p>
        <strong>Mô tả:</strong> {course.content}
      </p>
      <Button type="primary" onClick={() => navigate(-1)}>
        Quay lại
      </Button>
    </div>
  );
};

export default CourseDetail;
