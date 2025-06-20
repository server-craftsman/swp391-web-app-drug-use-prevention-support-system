// CourseCard.com.tsx
import React from "react";
import { Card, Typography } from "antd";
import { Link } from "react-router-dom";
const { Paragraph } = Typography;
import type { Course } from "../../../types/course/Course.type";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { helpers, cn } from "../../../utils";

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
        className="m-1 p-2 rounded-lg shadow-sm"
        style={{ width: 300, height: 400 }}
        cover={
          <img
            alt={course.name}
            src={course.imageUrl}
            style={{ height: "200px", objectFit: "cover" }}
            className="w-full"
          />
        }
      >
        <div className="flex flex-col h-48">
          <h3 className="text-lg font-semibold mb-2 text-ellipsis line-clamp-1 overflow-hidden">
            {course.name}
          </h3>
          <Paragraph className="text-sm text-gray-500 line-clamp-2 mb-auto text-ellipsis overflow-hidden">
            {course.content}
          </Paragraph>
          <div className="mt-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">Giá:</span>
              <span className={cn("text-primary", "font-bold", "text-2xl")}>
                {helpers.formatCurrency(course.price)}
              </span>
            </div>
            {course.discount > 0 && (
              <span className="text-lg text-green-600 font-medium">
                Giảm giá: {course.discount * 100}%
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
