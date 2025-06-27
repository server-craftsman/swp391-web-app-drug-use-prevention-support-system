import React from "react";
import { Typography, Row, Col, Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface CourseHighlightsProps {
  highlights: string[];
}

const CourseHighlights: React.FC<CourseHighlightsProps> = ({ highlights }) => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <Title level={3} className="text-gray-900 mb-6">Bạn sẽ học được gì</Title>
      <Row gutter={[16, 12]}>
        {highlights.map((highlight, index) => (
          <Col xs={24} sm={12} key={index}>
            <div className="flex items-start">
              <CheckOutlined className="text-green-600 mr-3 mt-1 flex-shrink-0" />
              <Text className="text-gray-700">{highlight}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default CourseHighlights; 