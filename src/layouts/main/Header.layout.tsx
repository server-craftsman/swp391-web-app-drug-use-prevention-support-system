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
    { name: "Tư Vấn", path: "/counseling" },
    { name: "Chương Trình Cộng Đồng", path: "/community" },
    { name: "Blog", path: "/blog" },
    { name: "Về Chúng Tôi", path: "/about" },
  ];

  const handleLogout = () => {
    logout();
  };

  const renderDashboardMenuItem = () => {
    if (role === UserRole.ADMIN) {
      return (
        <Menu.Item
          key="dashboard"
          icon={<DashboardOutlined />}
          onClick={() => navigate(ROUTER_URL.ADMIN.BASE)}
        >
          Quản trị
        </Menu.Item>
      );
    }
    return null;
  };

  // Using Cult UI styling for the dropdown menu
  const userMenu = (
    <Menu className="rounded-md shadow-md border border-gray-100 w-56 py-1 bg-white">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-500">Đã đăng nhập với</p>
        <p className="text-sm font-medium truncate">{userInfo?.email}</p>
      </div>
      {renderDashboardMenuItem()}
      <Menu.Item
        key="profile"
        icon={<UserOutlined className="text-gray-600" />}
        className={cn("hover:bg-gray-50 transition-colors")}
        onClick={() => navigate("/profile")}
      >
        <span className="text-gray-700">Hồ sơ cá nhân</span>
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined className="text-gray-600" />}
        className={cn("hover:bg-gray-50 transition-colors")}
        onClick={() => navigate("/settings")}
      >
        <span className="text-gray-700">Cài đặt</span>
      </Menu.Item>
      <Menu.Divider className="my-1 border-gray-100" />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined className="text-red-500" />}
        className={cn("hover:bg-red-50 transition-colors")}
        onClick={handleLogout}
      >
        <span className="text-red-500">Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  // Helper function to get the user's full name
  const getUserFullName = () => {
    if (!userInfo) return "User";

    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }

    return userInfo.email;
  };

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
              to="/cart"
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
