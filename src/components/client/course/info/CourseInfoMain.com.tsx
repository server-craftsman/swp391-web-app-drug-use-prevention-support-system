import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../../../types/course/Course.res.type";
import CourseInfoHeader from "./CourseInfoHeader.com.tsx";
import CourseInfoPrice from "./CourseInfoPrice.com.tsx";
import CourseInfoDetails from "./CourseInfoDetails.com.tsx";
import CourseInfoActions from "./CourseInfoActions.com.tsx";

interface CourseInfoCardProps {
  course: Course;
}

const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-3xl">
      <Card 
        className="overflow-hidden border-0 shadow-2xl"
        style={{ 
          borderRadius: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <CourseInfoHeader course={course} />
        
        <div className="bg-white p-8">
          <CourseInfoPrice course={course} />
          <CourseInfoDetails course={course} />
          <CourseInfoActions course={course} navigate={navigate} />
        </div>
      </Card>
    </div>
  );
};

export default CourseInfoCard; 