import React from "react";
import { Card } from "antd";
const { Meta } = Card;

interface Course {
  id: number;
  name: string;
  userId: number;
  categoryId: number;
  content: string;
  status: string;
  targetAudience: string;
  videoUrl: string;
  imageUrl: string;
  price: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <Card
    hoverable
    className="m-3 p-2"
    style={{ width: 240 }}
    cover={
      <img
        alt={course.name}
        src={course.imageUrl}
        style={{ width: "240px", height: "300px", objectFit: "cover" }}
      />
    }
  >
    <Meta title={course.name} description={`Price: $${course.price}`} />
  </Card>
);

export default CourseCard;
