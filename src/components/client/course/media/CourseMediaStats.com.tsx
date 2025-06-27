import React from "react";
import { Row, Col, Statistic, Card } from "antd";
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined, 
  PlayCircleOutlined 
} from "@ant-design/icons";

const CourseMediaStats: React.FC = () => {
  const stats = [
    {
      title: "Học viên",
      value: 1234,
      icon: <UserOutlined className="text-blue-500" />,
      suffix: "+"
    },
    {
      title: "Thời lượng",
      value: "12.5",
      icon: <ClockCircleOutlined className="text-green-500" />,
      suffix: " giờ"
    },
    {
      title: "Bài học",
      value: 45,
      icon: <PlayCircleOutlined className="text-purple-500" />,
      suffix: " bài"
    },
    {
      title: "Hoàn thành",
      value: 89,
      icon: <TrophyOutlined className="text-yellow-500" />,
      suffix: "%"
    }
  ];

  return (
    <Card 
      className="border-0 bg-gradient-to-r from-gray-50 to-blue-50"
      bodyStyle={{ padding: "16px" }}
    >
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <Statistic
                title={
                  <span className="text-xs text-gray-600 font-medium">
                    {stat.title}
                  </span>
                }
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1f2937"
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default CourseMediaStats; 