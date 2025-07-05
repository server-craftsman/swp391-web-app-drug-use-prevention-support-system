import React, { useState } from "react";
import SidebarLayout from "./Sidebar.layout";
import { Outlet, useLocation } from "react-router-dom";
import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  Badge,
  Card,
  Row,
  Col,
  Button,
  Input,
  Typography,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  AlertOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth.context";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import FooterLayout from "../main/Footer.layout";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const [notificationCount] = useState(5); // Mock notification count

  // Mock stats data - in real app, this would come from API
  const quickStats = [
    {
      title: "Tổng Người Dùng",
      value: 2847,
      icon: <TeamOutlined className="text-blue-500" />,
      trend: "+12%",
    },
    {
      title: "Khóa Học Hoạt Động",
      value: 23,
      icon: <BookOutlined className="text-green-500" />,
      trend: "+3%",
    },
    {
      title: "Đánh Giá Nguy Cơ",
      value: 156,
      icon: <FileTextOutlined className="text-orange-500" />,
      trend: "+8%",
    },
    {
      title: "Cảnh Báo Hệ Thống",
      value: 3,
      icon: <AlertOutlined className="text-red-500" />,
      trend: "-2",
    },
  ];

  // Generate breadcrumb from current path
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems = [{ title: "Trang Chủ", href: "/admin" }];

    const routeMap: { [key: string]: string } = {
      overview: "Tổng Quan",
      users: "Quản Lý Người Dùng",
      "manager-user": "Quản Lý Tài Khoản",
      "manager-blog": "Quản Lý Blog",
      "manager-course": "Quản Lý Khóa Học",
      "manager-category": "Quản Lý Danh Mục",
      settings: "Cài Đặt",
      // Analytics & Reporting
      analytics: "Thống Kê & Báo Cáo",
      // User Management
      "staff-consultants": "Nhân Viên & Tư Vấn",
      permissions: "Phân Quyền Hệ Thống",
      // Content & Programs
      "community-programs": "Chương Trình Cộng Đồng",
      resources: "Tài Nguyên Hỗ Trợ",
      // Assessment & Counseling
      assessments: "Công Cụ Đánh Giá",
      consultations: "Lịch Tư Vấn",
      "emergency-support": "Hỗ Trợ Khẩn Cấp",
      // System
      alerts: "Cảnh Báo & Thông Báo",
      messages: "Tin Nhắn & Liên Lạc",
      security: "Bảo Mật & Kiểm Soát",
    };

    pathSegments.slice(1).forEach((segment, index) => {
      const title =
        routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        title,
        href: "/" + pathSegments.slice(0, index + 2).join("/"),
      });
    });

    return breadcrumbItems;
  };

  const userMenu = (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 min-w-[200px] py-2">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="font-medium text-gray-900">
          {userInfo?.firstName} {userInfo?.lastName}
        </p>
        <p className="text-sm text-gray-500">Quản trị viên</p>
      </div>
      <div className="py-1">
        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <UserOutlined className="mr-3" />
          Hồ sơ cá nhân
        </button>
        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <SettingOutlined className="mr-3" />
          Cài đặt
        </button>
        <div className="border-t border-gray-100 my-1"></div>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogoutOutlined className="mr-3" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-gray-50">
      <SidebarLayout />

      <Layout
        style={{ marginLeft: "320px" }}
        className="lg:ml-80 md:ml-0 sm:ml-0"
      >
        {/* Enhanced Header */}
        <Header className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <Title level={4} className="mb-0 text-gray-800">
              Bảng Điều Khiển Quản Trị
            </Title>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm kiếm..."
              className="w-64"
              size="middle"
            />

            {/* Quick Actions */}
            <Button
              type="text"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
            >
              <ArrowUpOutlined />
              <span className="hidden sm:inline">Báo cáo</span>
            </Button>

            {/* Notifications */}
            <Badge count={notificationCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-gray-600 hover:text-primary"
              />
            </Badge>

            {/* User Menu */}
            <Dropdown
              overlay={userMenu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                <Avatar
                  src={userInfo?.profilePicUrl}
                  icon={<UserOutlined />}
                  className="bg-primary"
                />
                <div className="hidden sm:block">
                  <Text className="block text-sm font-medium">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </Text>
                  <Text className="block text-xs text-gray-500">Admin</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content Area */}
        <Content className="p-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Breadcrumb items={generateBreadcrumb()} className="text-sm" />
          </motion.div>

          {/* Quick Stats - Only show on dashboard */}
          {location.pathname === "/admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Row gutter={[16, 16]}>
                {quickStats.map((stat, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                      className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm"
                      bodyStyle={{ padding: "20px" }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            {stat.title}
                          </Text>
                          <Title level={3} className="mb-0 text-gray-800">
                            {stat.value.toLocaleString()}
                          </Title>
                          <Text
                            className={cn(
                              "text-sm font-medium",
                              stat.trend.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {stat.trend}
                          </Text>
                        </div>
                        <div className="text-3xl opacity-80">{stat.icon}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]"
          >
            <div className="p-6">
              <Outlet />
            </div>
          </motion.div>
        </Content>

        <Footer className="p-0">
          <FooterLayout />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
