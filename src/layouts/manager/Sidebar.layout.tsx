import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    DashboardOutlined,
    TeamOutlined,
    BarChartOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    FileTextOutlined,
    CalendarOutlined,
    BookOutlined,
    BankOutlined,
    LineChartOutlined,
    SafetyOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth.context";
import { ROUTER_URL } from "../../consts/router.path.const";

const { Sider } = Layout;

// Hàm dùng chung cho focus effects
const createFocusHandlers = (itemName: string) => ({
    onFocus: (e: any) => {
        e.target.style.transform = 'scale(1.01)';
        e.target.style.transition = 'all 0.15s ease';
        e.target.style.backgroundColor = 'rgba(24, 144, 255, 0.1)';
        e.target.style.borderRadius = '6px';
        console.log(`${itemName} item focused`);
    },
    onBlur: (e: any) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.backgroundColor = 'transparent';
        console.log(`${itemName} item blurred`);
    }
});

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
                onClick: () => navigate("/manager/settings"),
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
            key: ROUTER_URL.MANAGER.BASE,
            icon: <DashboardOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.BASE}>Tổng quan</Link>,
            ...createFocusHandlers('Manager Dashboard')
        },
        {
            key: ROUTER_URL.MANAGER.ANALYTICS,
            icon: <LineChartOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.ANALYTICS}>Phân tích dữ liệu</Link>,
            ...createFocusHandlers('Manager Analytics')
        },
        {
            key: ROUTER_URL.MANAGER.USERS,
            icon: <TeamOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.USERS}>Quản lý nhân sự</Link>,
            ...createFocusHandlers('Manager Users')
        },
        {
            key: ROUTER_URL.MANAGER.PROGRAMS,
            icon: <AppstoreOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.PROGRAMS}>Chương trình</Link>,
            ...createFocusHandlers('Manager Programs')
        },
        {
            key: ROUTER_URL.MANAGER.SURVEYS,
            icon: <BookOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.SURVEYS}>Khảo sát</Link>,
            ...createFocusHandlers('Manager Surveys')
        },
        {
            key: ROUTER_URL.MANAGER.CATEGORIES,
            icon: <AppstoreOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.CATEGORIES}>Danh mục</Link>,
            ...createFocusHandlers('Manager Categories')
        },
        {
            key: ROUTER_URL.MANAGER.COURSES,
            icon: <BookOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.COURSES}>Khóa học</Link>,
            ...createFocusHandlers('Manager Courses')
        },
        {
            key: ROUTER_URL.MANAGER.REPORTS,
            icon: <BarChartOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.REPORTS}>Báo cáo</Link>,
            ...createFocusHandlers('Manager Reports')
        },
        {
            key: ROUTER_URL.MANAGER.COMPLIANCE,
            icon: <SafetyOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.COMPLIANCE}>Tuân thủ</Link>,
            ...createFocusHandlers('Manager Compliance')
        },
        {
            key: ROUTER_URL.MANAGER.OPERATIONS,
            icon: <BankOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.OPERATIONS}>Vận hành</Link>,
            ...createFocusHandlers('Manager Operations')
        },
        {
            key: ROUTER_URL.MANAGER.SCHEDULE,
            icon: <CalendarOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.SCHEDULE}>Lịch hẹn tư vấn</Link>,
            ...createFocusHandlers('Manager Schedule')
        },
        {
            key: ROUTER_URL.MANAGER.REVIEWS,
            icon: <FileTextOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.REVIEWS}>Đánh giá</Link>,
            ...createFocusHandlers('Manager Reviews')
        },
        {
            key: ROUTER_URL.MANAGER.SETTINGS,
            icon: <SettingOutlined />,
            label: <Link to={ROUTER_URL.MANAGER.SETTINGS}>Cài đặt</Link>,
            ...createFocusHandlers('Manager Settings')
        },
    ];

    const getSelectedKey = () => {
        const path = location.pathname;
        // Cải thiện logic selection để tránh bug
        const exactMatch = menuItems.find(item => path === item.key);
        if (exactMatch) return exactMatch.key;

        const startsWithMatch = menuItems.find(item => path.startsWith(item.key));
        if (startsWithMatch) return startsWithMatch.key;

        return ROUTER_URL.MANAGER.BASE;
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
                        <Link to={ROUTER_URL.COMMON.HOME}>
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500 rounded p-2 text-white font-bold">
                                    QL
                                </div>
                                <div className="text-white">
                                    <div className="text-sm font-medium">Quản lý</div>
                                    <div className="text-xs text-gray-300">Phòng ngừa ma túy</div>
                                </div>
                            </div>
                        </Link>
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
