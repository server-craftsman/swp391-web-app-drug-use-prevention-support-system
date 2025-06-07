import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchCom from "../../components/common/search.com";

const HeaderLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const mainPath = pathSegments.length > 1 && pathSegments[1] !== "" 
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
          
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
              Đăng Nhập
            </Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="bg-primary text-white">
        <div className="container mx-auto">
          <ul className="flex flex-wrap">
            {navItems.map((item) => (
              <li key={item.path} className="relative">
                <Link 
                  to={item.path} 
                  className={`inline-block py-4 px-6 font-bold transition-colors duration-300 
                    ${activeTab === item.path ? 'bg-secondary text-white' : 'hover:bg-secondary text-white'}`}
                  onClick={() => setActiveTab(item.path)}
                >
                  {item.name}
                  {activeTab === item.path && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 
                      border-l-[10px] border-l-transparent 
                      border-t-[10px] border-t-[#153759]
                      border-r-[10px] border-r-transparent"></span>
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