import React, { useEffect, useState } from "react";
import { Spin, Typography, Row, Col, Card } from "antd";
import { DashboardService } from "../../../services/dashboard/dashboard.service";
import type { DashboardOverallResponse } from "../../../types/dashboard/Dashboard.res.type";
import {
  UsergroupAddOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  ReadOutlined,
  FormOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const stats = [
  {
    key: "totalUsers",
    label: "Tổng Người Dùng",
    icon: <UsergroupAddOutlined style={{ fontSize: 36, color: "#6C8AE4" }} />,
    color: "#f5f8ff",
  },
  {
    key: "totalCourses",
    label: "Khóa Học",
    icon: <BookOutlined style={{ fontSize: 36, color: "#4ADE80" }} />,
    color: "#f0fdf4",
  },
  {
    key: "totalCommunityPrograms",
    label: "Chương Trình Cộng Đồng",
    icon: <TeamOutlined style={{ fontSize: 36, color: "#fbbf24" }} />,
    color: "#fefce8",
  },
  {
    key: "totalConsultants",
    label: "Tư Vấn Viên",
    icon: <ReadOutlined style={{ fontSize: 36, color: "#f472b6" }} />,
    color: "#fdf2f8",
  },
  {
    key: "totalBlogs",
    label: "Blog",
    icon: <FileTextOutlined style={{ fontSize: 36, color: "#38bdf8" }} />,
    color: "#f0f9ff",
  },
  {
    key: "totalSurveys",
    label: "Khảo Sát",
    icon: <FormOutlined style={{ fontSize: 36, color: "#a78bfa" }} />,
    color: "#f5f3ff",
  },
];

const Overview: React.FC = () => {
  const [data, setData] = useState<DashboardOverallResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await DashboardService.getDashboardOverall({
          pageSize: 10,
          pageNumber: 1,
        });
        if (res.data?.success && res.data?.data) {
          setData(res.data.data as DashboardOverallResponse);
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Text type="danger">Không thể tải dữ liệu tổng quan.</Text>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Tổng quan hệ thống</Title>
      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={stat.key}>
            <Card
              style={{
                borderRadius: 16,
                background: stat.color,
                boxShadow: "0 2px 12px 0 rgba(32,85,138,0.07)",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div>{stat.icon}</div>
                <div>
                  <Text
                    style={{ fontSize: 16, color: "#555", fontWeight: 500 }}
                  >
                    {stat.label}
                  </Text>
                </div>
              </div>
              <div
                style={{
                  marginTop: 24,
                  fontWeight: 700,
                  fontSize: 32,
                  color: "#222",
                }}
              >
                {data[stat.key as keyof DashboardOverallResponse] ?? 0}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Overview;
