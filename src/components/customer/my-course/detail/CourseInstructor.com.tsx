import React from "react";
import { Typography, Card, Avatar, Rate } from "antd";
import { CheckOutlined, UserOutlined, PlayCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface CourseInstructorProps {
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({ 
  instructorName = "Huy Nguyen",
  instructorTitle = "Founder at M&A.vn",
  instructorAvatar
}) => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <Title level={3} className="text-gray-900 mb-6">Giảng viên</Title>
      
      <div className="flex items-start space-x-4 mb-6">
        <Avatar size={80} src={instructorAvatar} className="flex-shrink-0 bg-blue-600">
          {instructorName.split(' ').map(name => name[0]).join('').toUpperCase()}
        </Avatar>
        <div className="flex-1">
          <Title level={4} className="text-gray-900 mb-2">
            <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">
              {instructorName}
            </span>
          </Title>
          <Text className="text-gray-600 block mb-3">{instructorTitle}</Text>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <Rate disabled defaultValue={1} count={1} className="text-yellow-400 mr-2" />
              <Text>4.8 xếp hạng giảng viên</Text>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckOutlined className="text-green-600 mr-2" />
              <Text>468 xếp hạng</Text>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <UserOutlined className="text-gray-500 mr-2" />
              <Text>1,745 học viên</Text>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <PlayCircleOutlined className="text-gray-500 mr-2" />
              <Text>3 khóa học</Text>
            </div>
          </div>
          
          <Paragraph className="text-gray-700 text-sm leading-relaxed">
            Technology Specialist in the financial and banking sector with more than 18 years of experience in building, 
            developing and solving complex software applications in IT, many banks and fintech companies in Vietnam
          </Paragraph>
          
          <Paragraph className="text-gray-700 text-sm leading-relaxed">
            Chuyên gia công nghệ trong lĩnh vực tài chính, ngân hàng với 18 năm kinh nghiệm trong việc xây dựng, phát 
            triển và giải quyết các bài toán phức tạp về công nghệ tại nhiều ngân hàng và công ty fintech tại Việt Nam
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default CourseInstructor; 