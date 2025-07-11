import { Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
const { Text } = Typography;

interface LessonVideoProps {
  videoUrl?: string;
  imageUrl?: string;
}

const LessonVideo: React.FC<LessonVideoProps> = ({ videoUrl, imageUrl }) =>
  videoUrl ? (
    <div style={{ margin: "32px 0" }}>
      <div className="flex items-center gap-2 mb-2">
        <VideoCameraOutlined className="text-blue-500" />
        <Text strong style={{ fontSize: 17 }}>
          Video bài học
        </Text>
      </div>
      <video
        controls
        width="100%"
        src={videoUrl}
        style={{ borderRadius: 14, background: "#000", maxHeight: 400 }}
        poster={imageUrl}
      />
    </div>
  ) : null;

export default LessonVideo;
