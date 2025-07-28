import React from "react";
import { Card, Typography } from "antd";
import type { Course } from "../../../types/course/Course.res.type";

const { Title, Paragraph } = Typography;

interface MyCourseCardProps {
  course: Course;
  onClick?: () => void;
}

const MyCourseCard: React.FC<MyCourseCardProps> = ({ course, onClick }) => (
  <Card
    hoverable
    onClick={onClick}
    className="my-course-card"
    style={{
      borderRadius: 18,
      minHeight: 480, // Tăng từ 400 lên 480
      cursor: "pointer",
      boxShadow: "0 6px 32px 0 rgba(32,85,138,0.10)",
      border: "none",
      overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
    styles={{
      body: {
        padding: "24px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: 180,
      },
    }}
    cover={
      course.imageUrls && course.imageUrls.length > 0 ? (
        <img
          alt={course.name}
          src={course.imageUrls[0]}
          style={{
            borderRadius: "18px 18px 0 0",
            height: 320, // Tăng từ 250 lên 320
            objectFit: "cover",
            width: "100%",
            boxShadow: "0 2px 12px 0 rgba(32,85,138,0.08)",
            transition: "transform 0.2s",
          }}
        />
      ) : (
        <div
          style={{
            height: 320, // Tăng từ 240 lên 320
            background: "#f3f4f6",
            borderRadius: "18px 18px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bdbdbd",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          No Image
        </div>
      )
    }
  >
    <Title
      level={4}
      ellipsis
      style={{
        color: "#20558A",
        fontWeight: 800,
        marginBottom: 8,
        fontSize: 22,
      }}
    >
      {course.name}
    </Title>
    <Paragraph
      ellipsis={{ rows: 2 }}
      style={{
        color: "#374151",
        fontSize: 16,
        marginBottom: 0,
      }}
    >
      {course.content || "Không có mô tả"}
    </Paragraph>
    <style>
      {`
        .my-course-card:hover {
          box-shadow: 0 12px 36px 0 rgba(32,85,138,0.18);
          transform: translateY(-6px) scale(1.03);
        }
        .my-course-card:hover img {
          transform: scale(1.04);
        }
      `}
    </style>
  </Card>
);

export default MyCourseCard;
