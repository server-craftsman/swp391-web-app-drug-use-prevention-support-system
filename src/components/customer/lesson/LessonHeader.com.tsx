import { Typography } from "antd";
const { Title, Text } = Typography;

interface LessonHeaderProps {
  sessionName?: string;
  lessonName: string;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  sessionName,
  lessonName,
}) => (
  <div style={{ marginBottom: 24, textAlign: "center" }}>
    {sessionName && (
      <Text
        style={{
          color: "#2563eb",
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {sessionName}
      </Text>
    )}
    <Title
      level={2}
      style={{
        color: "#20558A",
        margin: sessionName ? "8px 0 0 0" : "0",
        fontWeight: 800,
        fontSize: 30,
        lineHeight: 1.2,
        letterSpacing: "-0.5px",
      }}
    >
      {lessonName}
    </Title>
  </div>
);

export default LessonHeader;
