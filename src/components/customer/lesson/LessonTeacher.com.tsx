import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
const { Text } = Typography;

const LessonTeacher: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
  <div className="flex items-center gap-2 mb-6">
    <Avatar
      src={lesson.userAvatar}
      icon={<UserOutlined />}
      size={40}
      style={{ background: "#2563eb" }}
    />
    <Text strong style={{ fontSize: 16 }}>
      {lesson.fullName}
    </Text>
  </div>
);

export default LessonTeacher;
