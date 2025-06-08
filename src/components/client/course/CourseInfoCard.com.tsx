import React from "react";
import { Card, Typography, Button } from "antd";
import AddToCartButton from "../../common/addToCartButton.com";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../../types/course/Course.type";
import { formatCurrency } from "../../../utils/helper";

const { Title, Paragraph, Text } = Typography;

interface CourseInfoCardProps {
  course: Course;
}

const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={2}>{course.name}</Title>
      <RateComponent />
      <Title level={4}>Mô tả khóa học</Title>
      <Paragraph className="text-lg">{course.content}</Paragraph>
      <Paragraph>
        <Text strong>Giá:</Text>{" "}
        <Text type="warning" style={{ fontSize: 18 }}>
          {formatCurrency(course.price)}
        </Text>
      </Paragraph>
      <AddToCartButton />
      <Button style={{ marginTop: 16 }} block onClick={() => navigate(-1)}>
        ← Quay lại
      </Button>
    </Card>
  );
};

export default CourseInfoCard;
