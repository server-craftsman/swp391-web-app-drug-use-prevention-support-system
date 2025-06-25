import React from "react";
import { Card } from "antd";
import TabsComponent from "../../common/tabs.com";
import type { Course } from "../../../types/course/Course.res.type";
import userData from "../../../data/user.json";
import type { User } from "../../../types/user/User";

interface CourseMediaCardProps {
  course: Course;
}

const users = userData as User[];
const getAuthorName = (userId: number | string | null | undefined) => {
  if (!userId) return "Không rõ";
  const user = users.find((u) => u.id === userId || u.id === String(userId));
  return user ? `${user.firstName} ${user.lastName}` : "Không rõ";
};

const CourseMediaCard: React.FC<CourseMediaCardProps> = ({ course }) => (
  <Card
    style={{ borderRadius: 12 }}
    cover={
      <div
        style={{
          width: "100%",
          height: 500,
          overflow: "hidden",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <img
          src={
            course.imageUrl && course.imageUrl !== "string"
              ? course.imageUrl
              : "/no-image.png"
          }
          alt={course.name || "Ảnh khóa học"}
          style={{
            width: "580px",
            height: "480px",
            maxHeight: "100%",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            transition:
              "transform 0.4s cubic-bezier(.4,2,.3,1), box-shadow 0.3s",
            display: "block",
            background: "#fff",
            objectFit: "cover",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.07)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
          }}
        />
      </div>
    }
  >
    <div style={{ marginBottom: 16, fontWeight: 500 }}>
      Tác giả: {getAuthorName(course.userId)}
    </div>
    <TabsComponent course={course} author={getAuthorName(course.userId)} />
  </Card>
);

export default CourseMediaCard;
