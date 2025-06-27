import React from "react";
import { Card, Typography, Button, Tag, Descriptions } from "antd";
import AddToCartButton from "../../common/addToCartButton.com";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../../types/course/Course.res.type";
import { formatCurrency } from "../../../utils/helper";

const { Title, Text } = Typography;

interface CourseInfoCardProps {
  course: Course;
}

const statusColor: Record<string, string> = {
  PUBLISHED: "green",
  ARCHIVED: "orange",
  DRAFT: "default",
};

const targetAudienceMap: Record<string, string> = {
  COMMUNITY: "Cộng đồng",
  TEACHER: "Giáo viên",
  PARENT: "Phụ huynh",
  STUDENT: "Học sinh",
  YOUTH: "Thanh thiếu niên",
};

const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ course }) => {
  const navigate = useNavigate();

  // Xử lý fallback cho các trường có thể null/undefined
  const status = (course.status || "DRAFT").toUpperCase();
  const targetAudience = course.targetAudience
    ? targetAudienceMap[course.targetAudience.toUpperCase()] ||
      course.targetAudience
    : "Không xác định";
  const price = typeof course.price === "number" ? course.price : 0;
  const discount = typeof course.discount === "number" ? course.discount : 0;

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={2}>{course.name || "Không có tên khóa học"}</Title>
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Trạng thái">
          <Tag color={statusColor[status] || "default"}>{status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Đối tượng">
          {targetAudience}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {discount > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text
                delete
                style={{
                  color: "#888",
                  fontSize: 15,
                  marginBottom: 2,
                  fontWeight: 400,
                }}
              >
                {formatCurrency(price)}
              </Text>
              <Text
                type="warning"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fa8c16",
                }}
              >
                {formatCurrency(price * (1 - discount))}
              </Text>
            </div>
          ) : (
            <Text
              type="warning"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fa8c16",
              }}
            >
              {formatCurrency(price)}
            </Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          {discount > 0 ? (
            <Tag color="red">-{Math.round(discount * 100)}%</Tag>
          ) : (
            <Text>Không</Text>
          )}
        </Descriptions.Item>
      </Descriptions>
      <AddToCartButton courseId={course.id} />
      <Button style={{ marginTop: 16 }} block onClick={() => navigate(-1)}>
        ← Quay lại
      </Button>
    </Card>
  );
};

export default CourseInfoCard;
