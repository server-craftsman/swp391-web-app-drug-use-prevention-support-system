import { Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
const { Paragraph, Text } = Typography;

interface LessonMainProps {
  imageUrl?: string;
  content?: string;
}

const LessonMain: React.FC<LessonMainProps> = ({ imageUrl, content }) => (
  <div
    className={`flex flex-col ${
      imageUrl ? "md:flex-row" : ""
    } gap-6 items-start`}
    style={{ marginBottom: 32 }}
  >
    {imageUrl && (
      <div style={{ flex: 1, minWidth: 0 }}>
        <img
          src={imageUrl}
          alt="lesson"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 16,
            boxShadow: "0 4px 24px #e0e7ef",
          }}
        />
      </div>
    )}
    <div style={{ flex: 2, minWidth: 0 }}>
      <div className="flex items-center gap-2 mb-2">
        <FileTextOutlined className="text-green-500" />
        <Text strong style={{ fontSize: 17 }}>
          Nội dung bài học
        </Text>
      </div>
      <Paragraph
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          marginBottom: 0,
          color: "#333",
        }}
      >
        {content}
      </Paragraph>
    </div>
  </div>
);

export default LessonMain;
