import React, { useEffect, useState } from "react";
import { Typography, message, Spin, Empty, Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CourseService } from "../../../services/course/course.service";
import type { Course } from "../../../types/course/Course.res.type";

const { Title } = Typography;

const MyCourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy userId từ localStorage
  let userId = "";
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id || "";
    } catch {
      userId = "";
    }
  }

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await CourseService.getMyCourses(userId);
        setCourses(res.data?.data || []);
      } catch (err) {
        message.error("Không thể tải danh sách khóa học của bạn!");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [userId]);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrls",
      key: "imageUrls",
      render: (images: string[]) =>
        images && images.length > 0 ? (
          <img
            src={images[0]}
            alt="course"
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 24,
            }}
          >
            ?
          </div>
        ),
      width: 80,
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: 600, color: "#20558A" }}>{text}</span>
      ),
    },
    {
      title: "Mức độ rủi ro",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (risk: string) => {
        let color = "#faad14";
        if (risk === "High") color = "#ff4d4f";
        if (risk === "Low") color = "#52c41a";
        return (
          <span style={{ color, fontWeight: 500 }}>
            {risk === "High"
              ? "Cao"
              : risk === "Medium"
              ? "Trung bình"
              : "Thấp"}
          </span>
        );
      },
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Course) => (
        <Button
          type="primary"
          onClick={() => navigate(`/courses/${record.id}`)}
        >
          Vào học
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fafd",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 24px 0 rgba(32,85,138,0.08)",
          padding: "40px 32px",
        }}
      >
        <Title
          level={2}
          style={{
            marginBottom: 32,
            textAlign: "center",
            color: "#20558A",
            fontWeight: 900,
            letterSpacing: "-1px",
            fontSize: 36,
          }}
        >
          Khóa học của tôi
        </Title>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "48px 0",
            }}
          >
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <div style={{ padding: "48px 0" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Bạn chưa có khóa học nào. Hãy khám phá và bắt đầu học!"
            />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={courses}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        )}
      </div>
    </div>
  );
};

export default MyCourseList;
