import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import type { Course } from "../../../types/course/CourseModel";

interface CourseCardProps {
  course: Course;
}
const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <Card
    hoverable
    className="m-1 p-2"
    style={{ width: 300, height: 500 }}
    cover={
      <img
        alt={course.name}
        src={course.imageUrl}
        style={{ width: "300px", height: "400px", objectFit: "cover" }}
      />
    }
  >
    <Meta title={course.name} description={`Price: $${course.price}`} />
  </Card>
);

export default CourseCard;
