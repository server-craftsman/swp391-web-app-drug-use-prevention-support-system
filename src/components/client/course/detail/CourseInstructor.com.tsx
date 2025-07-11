import React, { useEffect, useState } from "react";
import { Typography, Card, Avatar, Spin, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";

const { Title, Text, Paragraph } = Typography;

interface CourseInstructorProps {
  instructorId: string;
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({
  instructorId,
}) => {
  const [instructor, setInstructor] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      setLoading(true);
      try {
        const res = await UserService.getUserById({ userId: instructorId });
        if (res.data?.success && res.data?.data) {
          setInstructor(res.data.data as UserResponse);
        } else {
          setInstructor(null);
        }
      } catch {
        setInstructor(null);
      } finally {
        setLoading(false);
      }
    };
    if (instructorId) fetchInstructor();
  }, [instructorId]);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Spin />
      </Card>
    );
  }

  if (!instructor) {
    return (
      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Text>Không tìm thấy thông tin giảng viên.</Text>
      </Card>
    );
  }

  // Data giả cho bằng cấp, kinh nghiệm, chuyên ngành
  const degree = "Thạc sĩ Tâm lý học";
  const experience = "8 năm giảng dạy và tư vấn";
  const major = "Tâm lý học giáo dục";

  return (
    <Card
      className="border-0 shadow-md"
      style={{
        borderRadius: 20,
        padding: 0,
      }}
    >
      <div className="flex items-center gap-6 p-6">
        <Avatar
          size={90}
          src={instructor.profilePicUrl}
          className="bg-blue-600 shadow-lg"
          icon={!instructor.profilePicUrl ? <UserOutlined /> : undefined}
          style={{
            border: "4px solid #fff",
            boxShadow: "0 4px 16px 0 rgba(32,85,138,0.10)",
          }}
        >
          {!instructor.profilePicUrl &&
            instructor.fullName
              ?.split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Title level={4} style={{ margin: 0, color: "#20558A" }}>
              {instructor.fullName}
            </Title>
          </div>
          <Text
            type="secondary"
            className="block mb-2"
            style={{ fontSize: 15 }}
          >
            {major}
          </Text>
          <div className="flex flex-wrap gap-4 mb-2">
            <div className="flex items-center gap-1 text-gray-700">
              <BookOutlined className="text-blue-400" />
              <Text>Bằng cấp:</Text>
              <Text strong className="ml-1">
                {degree}
              </Text>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <StarOutlined className="text-yellow-500" />
              <Text>Kinh nghiệm:</Text>
              <Text strong className="ml-1">
                {experience}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <MailOutlined className="text-gray-400" />
            <Text>Email: {instructor.email || "Chưa cập nhật"}</Text>
          </div>
          {instructor.ageGroup && (
            <Tag color="geekblue" style={{ marginTop: 4 }}>
              Nhóm tuổi: {instructor.ageGroup}
            </Tag>
          )}
        </div>
      </div>
      <Paragraph
        className="text-gray-700 text-sm leading-relaxed px-6 pb-4"
        style={{ margin: 0 }}
      >
        {`Giảng viên ${instructor.fullName} là chuyên gia trong lĩnh vực ${major} với nhiều năm kinh nghiệm giảng dạy và tư vấn.`}
      </Paragraph>
    </Card>
  );
};

export default CourseInstructor;
