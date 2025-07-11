import { Tooltip, Typography } from "antd";
import { FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";
const { Text } = Typography;

const LessonMeta: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
  <div className="flex flex-wrap items-center gap-3 mb-4">
    <Tooltip title="Ngày tạo">
      <Text type="secondary" className="flex items-center gap-1">
        <CalendarOutlined />
        {lesson.createdAt
          ? new Date(lesson.createdAt).toLocaleDateString("vi-VN")
          : "Không rõ ngày tạo"}
      </Text>
    </Tooltip>
    <Tooltip title="Vị trí trong chương">
      <Text type="secondary" className="flex items-center gap-1">
        <FileTextOutlined /> #{lesson.positionOrder}
      </Text>
    </Tooltip>
  </div>
);

export default LessonMeta;
