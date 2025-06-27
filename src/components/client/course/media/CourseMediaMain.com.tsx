import React from "react";
import { Card } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";
import CourseMediaImage from "./CourseMediaImage.com.tsx";
import CourseMediaAuthor from "./CourseMediaAuthor.com.tsx";
import CourseMediaTags from "./CourseMediaTags.com.tsx";
import CourseMediaTabs from "./CourseMediaTabs.com.tsx";
import CourseMediaStats from "./CourseMediaStats.com.tsx";

interface CourseMediaCardProps {
  course: Course;
}

const CourseMediaCard: React.FC<CourseMediaCardProps> = ({ course }) => {
  return (
    <div className="max-w-[2000px] mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl">
      <Card
        className="overflow-hidden border-0 shadow-2xl group"
        style={{ 
          borderRadius: 24,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
        bodyStyle={{ padding: 0 }}
        cover={<CourseMediaImage course={course} />}
      >
        <div className="p-8 bg-white">
          <CourseMediaAuthor course={course} />
          <CourseMediaTags />
          <CourseMediaTabs course={course} />
          <CourseMediaStats />
        </div>
      </Card>
    </div>
  );
};

export default CourseMediaCard; 