import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchCom from "../../components/common/search.com";
import { useAuth } from "../../contexts/Auth.context";
import { useCart } from "../../contexts/Cart.context";
import { Dropdown, Avatar, Menu, Badge } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EditOutlined,
  LineChartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { UserRole } from "../../app/enums";
import { ROUTER_URL } from "../../consts/router.path.const";
import { cn } from "../../utils/cn";

const HeaderLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, token, userInfo, logout } = useAuth();
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const mainPath =
      pathSegments.length > 1 && pathSegments[1] !== ""
        ? `/${pathSegments[1]}`
        : "/";
    setActiveTab(mainPath);
  }, [location]);

  const navItems = [
    { name: "Trang Chủ", path: "/" },
    { name: "Khóa Học", path: "/courses" },
    { name: "Đánh Giá Nguy Cơ", path: "/assessment" },
    { name: "Tư Vấn", path: ROUTER_URL.CLIENT.APPOINTMENTS },
    { name: "Chương Trình Cộng Đồng", path: ROUTER_URL.CLIENT.PROGRAM },
    { name: "Blog", path: "/blog" },
    { name: "Về Chúng Tôi", path: "/about" },
  ];

  const handleLogout = () => {
    logout();
  };

  // Helper function to get the user's full name
  const getUserFullName = () => {
    if (!userInfo) return "User";

    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }

    return userInfo.email;
  };

  // Role-based dashboard menu items
  const getRoleDashboardItems = () => {
    const items = [];

    switch (role) {
      case UserRole.ADMIN:
        items.push(
          {
            key: "admin-dashboard",
            icon: <DashboardOutlined className="text-red-600" />,
            label: (
              <span className="text-gray-700">Quản trị hệ thống</span>
            ),
            onClick: () => navigate(ROUTER_URL.ADMIN.BASE),
          },
          {
            key: "admin-users",
            icon: <TeamOutlined className="text-red-600" />,
            label: (
              <span className="text-gray-700">Quản lý người dùng</span>
            ),
            onClick: () => navigate(ROUTER_URL.ADMIN.USERS),
          }
        );
        break;

      case UserRole.MANAGER:
        items.push(
          {
            key: "manager-dashboard",
            icon: <DashboardOutlined className="text-purple-600" />,
            label: (
              <span className="text-gray-700">Bảng điều khiển quản lý</span>
            ),
            onClick: () => navigate(ROUTER_URL.MANAGER.BASE),
          },
          {
            key: "manager-analytics",
            icon: <LineChartOutlined className="text-purple-600" />,
            label: (
              <span className="text-gray-700">Phân tích dữ liệu</span>
            ),
            onClick: () => navigate(ROUTER_URL.MANAGER.ANALYTICS),
          },
          {
            key: "manager-staff",
            icon: <TeamOutlined className="text-purple-600" />,
            label: (
              <span className="text-gray-700">Quản lý nhân sự</span>
            ),
            onClick: () => navigate(ROUTER_URL.MANAGER.STAFF),
          }
        );
        break;

      case UserRole.STAFF:
        items.push(
          {
            key: "staff-dashboard",
            icon: <DashboardOutlined className="text-green-600" />,
            label: (
              <span className="text-gray-700">Bảng điều khiển nhân viên</span>
            ),
            onClick: () => navigate(ROUTER_URL.STAFF.BASE),
          },
          {
            key: "staff-courses",
            icon: <BookOutlined className="text-green-600" />,
            label: (
              <span className="text-gray-700">Quản lý khóa học</span>
            ),
            onClick: () => navigate(ROUTER_URL.STAFF.COURSES),
          },
          {
            key: "staff-content",
            icon: <EditOutlined className="text-green-600" />,
            label: (
              <span className="text-gray-700">Quản lý nội dung</span>
            ),
            onClick: () => navigate(ROUTER_URL.STAFF.CONTENT),
          }
        );
        break;

      case UserRole.CONSULTANT:
        items.push(
          {
            key: "consultant-dashboard",
            icon: <DashboardOutlined className="text-blue-600" />,
            label: (
              <span className="text-gray-700">Bảng điều khiển tư vấn</span>
            ),
            onClick: () => navigate(ROUTER_URL.CONSULTANT.BASE),
          },
          {
            key: "consultant-overview",
            icon: <CalendarOutlined className="text-blue-600" />,
            label: (
              <span className="text-gray-700">Tổng quan</span>
            ),
            onClick: () => navigate(ROUTER_URL.CONSULTANT.OVERVIEW),
          },
          {
            key: "consultant-users",
            icon: <TeamOutlined className="text-blue-600" />,
            label: (
              <span className="text-gray-700">Quản lý người dùng</span>
            ),
            onClick: () => navigate(ROUTER_URL.CONSULTANT.USERS),
          }
        );
        break;

      case UserRole.CUSTOMER:
        items.push(
          {
            key: "customer-dashboard",
            icon: <DashboardOutlined className="text-primary" />,
            label: (
              <span className="text-gray-700">Trang cá nhân</span>
            ),
            onClick: () => navigate(ROUTER_URL.CUSTOMER.BASE),
          },
          {
            key: "my-courses",
            icon: <BookOutlined className="text-primary" />,
            label: (
              <span className="text-gray-700">Khóa học của tôi</span>
            ),
            onClick: () => navigate(ROUTER_URL.CLIENT.COURSE),
          },
          {
            key: "my-assessments",
            icon: <FileTextOutlined className="text-primary" />,
            label: (
              <span className="text-gray-700">Đánh giá của tôi</span>
            ),
            onClick: () => navigate(ROUTER_URL.CLIENT.ASSESSMENT),
          }
        );
        break;

      default:
        break;
    }

    return items;
  };

  // Get role display name
  const getRoleDisplayName = () => {
    switch (role) {
      case UserRole.ADMIN:
        return "Quản trị viên";
      case UserRole.MANAGER:
        return "Quản lý";
      case UserRole.STAFF:
        return "Nhân viên";
      case UserRole.CONSULTANT:
        return "Tư vấn viên";
      case UserRole.CUSTOMER:
        return "Khách hàng";
      default:
        return "Người dùng";
    }
  };

  // Get role color
  const getRoleColor = () => {
    switch (role) {
      case UserRole.ADMIN:
        return "text-red-600";
      case UserRole.MANAGER:
        return "text-purple-600";
      case UserRole.STAFF:
        return "text-green-600";
      case UserRole.CONSULTANT:
        return "text-blue-600";
      case UserRole.CUSTOMER:
        return "text-primary";
      default:
        return "text-gray-600";
    }
  };

  // Role-based user menu with enhanced structure
  const userMenu = (
    <Menu className="rounded-md shadow-md border border-gray-100 w-64 py-1 bg-white">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar
            src={userInfo?.profilePicUrl}
            icon={!userInfo?.profilePicUrl && <UserOutlined />}
            size="large"
            className="bg-primary"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getUserFullName()}
            </p>
            <p className={cn("text-xs font-medium", getRoleColor())}>
              {getRoleDisplayName()}
            </p>
            <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      {/* Role-specific Dashboard Items */}
      {getRoleDashboardItems().length > 0 && (
        <>
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Bảng điều khiển
            </p>
          </div>
          {getRoleDashboardItems().map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={cn("hover:bg-gray-50 transition-colors mx-2 rounded")}
              onClick={item.onClick}
            >
              {item.label}
            </Menu.Item>
          ))}
          <Menu.Divider className="my-1 border-gray-100" />
        </>
      )}

      {/* Common Customer Features */}
      {role && (
        <>
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tài khoản
            </p>
          </div>
          {/* <Menu.Item
            key="profile"
            icon={<UserOutlined className="text-gray-600" />}
            className={cn("hover:bg-gray-50 transition-colors mx-2 rounded")}
            onClick={() => navigate("/profile")}
          >
            <span className="text-gray-700">Hồ sơ cá nhân</span>
          </Menu.Item> */}
          <Menu.Item
            key="settings"
            icon={<SettingOutlined className="text-gray-600" />}
            className={cn("hover:bg-gray-50 transition-colors mx-2 rounded")}
            onClick={() => {
              // Navigate to role-specific settings
              switch (role) {
                case UserRole.ADMIN:
                  navigate(ROUTER_URL.ADMIN.SETTINGS);
                  break;
                case UserRole.MANAGER:
                  navigate(ROUTER_URL.MANAGER.SETTINGS);
                  break;
                case UserRole.STAFF:
                  navigate(ROUTER_URL.STAFF.SETTINGS);
                  break;
                case UserRole.CONSULTANT:
                  navigate(ROUTER_URL.CONSULTANT.SETTINGS);
                  break;
                case UserRole.CUSTOMER:
                  navigate(ROUTER_URL.CUSTOMER.SETTINGS);
                  break;
                default:
                  navigate("/settings");
                  break;
              }
            }}
          >
            <span className="text-gray-700">Cài đặt</span>
          </Menu.Item>

          {/* Show customer-specific items for all roles */}
          <Menu.Item
            key="favorites"
            icon={<HeartOutlined className="text-gray-600" />}
            className={cn("hover:bg-gray-50 transition-colors mx-2 rounded")}
            onClick={() => navigate("/favorites")}
          >
            <span className="text-gray-700">Yêu thích</span>
          </Menu.Item>
          <Menu.Item
            key="cart"
            icon={<ShoppingCartOutlined className="text-gray-600" />}
            className={cn("hover:bg-gray-50 transition-colors mx-2 rounded")}
            onClick={() => navigate(ROUTER_URL.CLIENT.CART)}
          >
            <span className="text-gray-700">Giỏ hàng</span>
          </Menu.Item>
          <Menu.Divider className="my-1 border-gray-100" />
        </>
      )}

      {/* Logout */}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined className="text-red-500" />}
        className={cn("hover:bg-red-50 transition-colors mx-2 rounded")}
        onClick={handleLogout}
      >
        <span className="text-red-500">Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="sticky top-0 z-50 transition-all duration-500">
      <div className="bg-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center transition-transform hover:scale-105 duration-300">
          <div className="mr-2">
            <div className="bg-primary rounded p-2 text-white font-bold transform hover:rotate-3 transition-transform">
              PDP
            </div>
            {/* Prevention Drug Program */}
          </div>
          <div className="text-gray-700 font-title">
            <div className="text-lg font-medium">Phòng Ngừa</div>
            <div className="text-md">Ma Túy Cộng Đồng</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchCom />

          {/* Cart Icon */}
          <Badge count={cartCount} size="small" color="#f50">
            <Link
              to={ROUTER_URL.CLIENT.CART}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCartOutlined className="text-xl text-gray-600 hover:text-primary transition-colors" />
              <span className="hidden md:inline text-gray-700 font-medium"></span>
            </Link>
          </Badge>

          {token && userInfo ? (
            <Dropdown
              overlay={userMenu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-md">
                <Avatar
                  src={userInfo.profilePicUrl}
                  icon={!userInfo.profilePicUrl && <UserOutlined />}
                  className="bg-primary"
                />
                <span className="font-medium">{getUserFullName()}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-between">
          <ul className="flex flex-wrap">
            {navItems.map((item) => (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`inline-block py-4 px-6 font-bold transition-colors duration-300 
        ${activeTab === item.path
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary text-white"
                    }`}
                  onClick={() => setActiveTab(item.path)}
                >
                  {item.name}

                  {activeTab === item.path && (
                    <span
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 
          border-l-[10px] border-l-transparent 
          border-t-[10px] border-t-[#153759]
          border-r-[10px] border-r-transparent"
                    ></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLayout;
