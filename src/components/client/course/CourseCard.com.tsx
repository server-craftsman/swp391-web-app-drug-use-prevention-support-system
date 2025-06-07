// CourseCard.com.tsx
import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
const { Meta } = Card;
import type { Course } from "../../../types/course/Course.type";
import { ROUTER_URL } from "../../../consts/router.path.const";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const courseDetailUrl = ROUTER_URL.CLIENT.COURSE_DETAIL.replace(
    ":courseId",
    course.id.toString()
  );

  return (
    <Link to={courseDetailUrl}>
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
    </Link>
  );
};

export default CourseCard;
