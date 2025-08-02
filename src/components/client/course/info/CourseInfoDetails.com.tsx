import React from "react";
import { Descriptions, Divider } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

interface CourseInfoDetailsProps {
  course: Course;
}

const CourseInfoDetails: React.FC<CourseInfoDetailsProps> = ({ course }) => {
  return (
    <>
      <Descriptions
        column={1}
        size="default"
        className="mb-6"
        labelStyle={{
          fontWeight: 600,
          color: '#374151',
          fontSize: '16px',
          width: '120px'
        }}
        contentStyle={{
          fontSize: '16px',
          color: '#6B7280'
        }}
      >
        <Descriptions.Item label="Mô tả">
          <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: course.content || "Chưa có mô tả" }} />
          </div>
        </Descriptions.Item>
      </Descriptions>

      <Divider />
    </>
  );
};

export default CourseInfoDetails; 