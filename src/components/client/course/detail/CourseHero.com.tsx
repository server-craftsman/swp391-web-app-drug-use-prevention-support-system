import React from "react";
import { Typography, Row, Col, Rate } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";

const { Text } = Typography;

interface CourseHeroProps {
  course: Course;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  const getTargetAudienceLabel = (audience: string) => {
    const map: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      parent: "Phụ huynh",
    };
    return map[audience] || audience;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{ background: "#f7fafd", padding: "32px 0" }}>
      <div
        style={{
          maxWidth: 1350,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 24px 0 rgba(32,85,138,0.08)",
          padding: "40px 48px",
        }}
      >
        <Row gutter={32} align="middle">
          {/* Ảnh đại diện khóa học chiếm 6 phần (60%) */}
          <Col xs={24} md={14} style={{ textAlign: "center" }}>
            <img
              src={
                course.imageUrls?.[0] ||
                "https://via.placeholder.com/320x180?text=No+Image"
              }
              alt={course.name}
              style={{
                width: "100%",
                maxWidth: 700,
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: 16,
                boxShadow: "0 2px 12px 0 rgba(32,85,138,0.10)",
                marginBottom: 16,
              }}
            />
          </Col>
          {/* Thông tin khóa học chiếm 4 phần (40%) */}
          <Col xs={24} md={10}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: 12 }}>
              <Text
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Phòng chống ma túy
              </Text>
              <Text style={{ color: "#bdbdbd", margin: "0 8px" }}>›</Text>
              <Text style={{ color: "#64748b", fontWeight: 500 }}>
                {getTargetAudienceLabel(course.targetAudience)}
              </Text>
            </div>
            {/* Title */}
            <h1
              style={{
                color: "#20558A",
                fontWeight: 900,
                fontSize: 42,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              {course.name}
            </h1>
            {/* Description */}
            <div
              style={{
                color: "#374151",
                fontSize: 20,
                margin: "18px 0 28px 0",
                fontWeight: 400,
              }}
            >
              {course.content}
            </div>
            {/* Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Rate
                  disabled
                  value={5}
                  allowHalf
                  style={{ color: "#faad14", fontSize: 22 }}
                />
                <span
                  style={{
                    color: "#faad14",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  5.0
                </span>
              </div>
              <span style={{ color: "#64748b", fontSize: 18 }}>
                230 học viên
              </span>
            </div>
            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                fontSize: 16,
                color: "#6b7280",
              }}
            >
              <span>
                <CalendarOutlined
                  style={{ marginRight: 4, color: "#2563eb" }}
                />
                {formatDate(course.createdAt)}
              </span>
              <span>
                <ClockCircleOutlined
                  style={{ marginRight: 4, color: "#2563eb" }}
                />
                Tiếng Việt
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseHero;
