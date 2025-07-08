import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    DashboardOutlined,
    UserOutlined,
    MessageOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    TeamOutlined,
    BarChartOutlined,
    BookOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth.context";
import { ROUTER_URL } from "../../consts/router.path.const";

const { Sider } = Layout;

const SidebarLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        message.success("Đăng xuất thành công!");
        navigate(ROUTER_URL.AUTH.LOGIN);
    };

    const userMenu: MenuProps = {
        items: [
            {
                key: "profile",
                icon: <UserOutlined />,
                label: "Hồ sơ cá nhân",
                onClick: () => navigate("/profile"),
            },
            {
                key: "settings",
                icon: <SettingOutlined />,
                label: "Cài đặt",
                onClick: () => navigate(ROUTER_URL.CONSULTANT.SETTINGS),
            },
            {
                type: "divider",
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Đăng xuất",
                onClick: handleLogout,
            },
        ],
    };

    const menuItems = [
        {
            key: ROUTER_URL.CONSULTANT.BASE,
            icon: <DashboardOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.BASE}>Tổng quan</Link>,
        },
        // {
        //     key: ROUTER_URL.CONSULTANT.APPOINTMENTS,
        //     icon: <CalendarOutlined />,
        //     label: <Link to={ROUTER_URL.CONSULTANT.APPOINTMENTS}>Lịch hẹn tư vấn</Link>,
        // },
        {
            key: ROUTER_URL.CONSULTANT.CLIENTS,
            icon: <TeamOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.CLIENTS}>Khách hàng</Link>,
        },
        {
            key: ROUTER_URL.CONSULTANT.APPOINTMENTS,
            icon: <MessageOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.APPOINTMENTS}>Phiên tư vấn</Link>,
        },
        {
            key: ROUTER_URL.CONSULTANT.ASSESSMENTS,
            icon: <FileTextOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.ASSESSMENTS}>Đánh giá nguy cơ</Link>,
        },
        {
            key: ROUTER_URL.CONSULTANT.RESOURCES,
            icon: <BookOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.RESOURCES}>Tài nguyên hỗ trợ</Link>,
        },
        {
            key: ROUTER_URL.CONSULTANT.REPORTS,
            icon: <BarChartOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.REPORTS}>Báo cáo</Link>,
        },
        {
            key: ROUTER_URL.CONSULTANT.SETTINGS,
            icon: <SettingOutlined />,
            label: <Link to={ROUTER_URL.CONSULTANT.SETTINGS}>Cài đặt</Link>,
        },
    ];

    const getSelectedKey = () => {
        const path = location.pathname;
        return menuItems.find(item => path.startsWith(item.key))?.key || ROUTER_URL.CONSULTANT.BASE;
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={250}
            style={{
                background: "#001529",
                position: "fixed",
                height: "100vh",
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-500 rounded p-2 text-white font-bold">
                                TVC
                            </div>
                            <div className="text-white">
                                <div className="text-sm font-medium">Tư vấn viên</div>
                                <div className="text-xs text-gray-300">Phòng ngừa ma túy</div>
                            </div>
                        </div>
                    )}
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 32,
                            height: 32,
                            color: "white",
                        }}
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[getSelectedKey()]}
                items={menuItems}
                style={{ border: "none", paddingTop: "16px" }}
            />

            {/* User Profile */}
            {!collapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <Dropdown menu={userMenu} trigger={["click"]} placement="topLeft">
                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                            <Avatar
                                src={userInfo?.profilePicUrl}
                                icon={!userInfo?.profilePicUrl && <UserOutlined />}
                                size="small"
                            />
                            <div className="text-white flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                    {userInfo?.firstName} {userInfo?.lastName}
                                </div>
                                <div className="text-xs text-gray-300 truncate">
                                    {userInfo?.email}
                                </div>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            )}
        </Sider>
    );
};

export default SidebarLayout;
