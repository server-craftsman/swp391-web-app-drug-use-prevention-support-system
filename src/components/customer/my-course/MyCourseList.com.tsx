import React, { useEffect, useState } from "react";
import { Typography, message, Row, Col, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { CourseService } from "../../../services/course/course.service";
import type { Course } from "../../../types/course/Course.res.type";
import MyCourseCard from "./MyCourseCard.com";

const { Title } = Typography;

const MyCourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy userId từ localStorage userInfo
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
            <Empty description="Bạn chưa có khóa học nào" />
          </div>
        ) : (
          <Row gutter={[32, 32]}>
            {courses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <MyCourseCard
                  course={course}
                  onClick={() => navigate(`/customer/my-course/${course.id}`)}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default MyCourseList;
