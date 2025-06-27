import React from "react";
import { Tabs, Typography } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface CourseMediaTabsProps {
  course: Course;
}

const CourseMediaTabs: React.FC<CourseMediaTabsProps> = ({ course }) => {
  return (
    <div className="mb-6">
      <Tabs 
        defaultActiveKey="1" 
        className="custom-tabs"
        tabBarStyle={{
          borderBottom: "2px solid #f1f5f9",
          marginBottom: "16px"
        }}
      >
        <TabPane 
          tab={
            <span className="font-medium text-gray-700">
              Tổng quan
            </span>
          } 
          key="1"
        >
          <div className="space-y-4">
            <Paragraph className="text-gray-600 leading-relaxed mb-4">
              {course.content || "Khóa học chuyên sâu về lĩnh vực M&A và đầu tư, được thiết kế để cung cấp kiến thức thực tiễn và kỹ năng cần thiết cho các chuyên gia tài chính."}
            </Paragraph>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <Text className="font-semibold text-blue-800 block mb-2">
                📚 Bạn sẽ học được gì:
              </Text>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Kiến thức cơ bản về M&A và đầu tư
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Phân tích tài chính chuyên sâu
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Chiến lược đầu tư hiệu quả
                </li>
              </ul>
            </div>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span className="font-medium text-gray-700">
              Đánh giá
            </span>
          } 
          key="2"
        >
          <div className="text-center py-8">
            <Text className="text-gray-500">
              Chưa có đánh giá nào cho khóa học này
            </Text>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span className="font-medium text-gray-700">
              Thảo luận
            </span>
          } 
          key="3"
        >
          <div className="text-center py-8">
            <Text className="text-gray-500">
              Tham gia thảo luận với các học viên khác
            </Text>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CourseMediaTabs; 