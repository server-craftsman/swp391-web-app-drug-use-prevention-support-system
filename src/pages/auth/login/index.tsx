import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FacebookFilled, TwitterOutlined, GoogleOutlined } from '@ant-design/icons'
import Background from '../../../assets/cover.jpg'
import { useState, useEffect } from 'react'
import { UserRole } from '../../../app/enums'
import { helpers } from '../../../utils'
import { useAuth } from '../../../contexts/Auth.context'
import type { UserResponse } from '../../../types/user/User.res.type'
import { ROUTER_URL } from '../../../consts/router.path.const'

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, role, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only redirect if already logged in and on the login page
  useEffect(() => {
    if (token && role && location.pathname === ROUTER_URL.AUTH.LOGIN) {
      setTimeout(() => {
        navigate(getDefaultPath(role), { replace: true });
      }, 2000);
    }
  }, [token, role, navigate, location.pathname]);

  const getDefaultPath = (userRole: string) => {
    switch (userRole) {
      case UserRole.ADMIN:
        return ROUTER_URL.ADMIN.BASE;
      case UserRole.CUSTOMER:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.MANAGER:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.STAFF:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.CONSULTANT:
        return ROUTER_URL.COMMON.HOME;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleLogin({ email, password } as UserResponse);
    } catch (error) {
      helpers.notificationMessage("Đăng nhập thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
        <img
          src={Background}
          alt="Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-full max-w-md relative z-20 transition-all duration-700 hover:shadow-blue-900/20 animate-fade-in">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-[#0056b3] border-l-[80px] border-l-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#0056b3] border-r-[80px] border-r-transparent z-10"></div>

        <div className="px-10 pt-14 pb-10">
          <Link to="/" className="transition-transform hover:scale-105 duration-300 block">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold mb-2">PDP</h1>
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Đăng nhập vào tài khoản</h2>
            </div>
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="mb-5 group">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-4 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-6 group">
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-4 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between mb-10">
              <button
                type="submit"
                className="bg-primary hover:bg-[#0056b3] text-white py-3 px-10 rounded transition-all duration-300 font-medium hover:shadow-lg hover:shadow-red-600/30 active:scale-98"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <Link to="/forgot-password" className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition-colors duration-300">
                Quên mật khẩu
              </Link>
            </div>
          </form>

          <div className="text-center mb-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600 text-sm">Hoặc đăng nhập bằng</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="flex items-center justify-center rounded-full bg-white border border-gray-300 p-2 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3b5998] text-white hover:scale-105 transition-transform">
                <FacebookFilled style={{ fontSize: '16px' }} />
              </span>
            </button>
            <button className="flex items-center justify-center rounded-full bg-white border border-gray-300 p-2 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1DA1F2] text-white hover:scale-105 transition-transform">
                <TwitterOutlined style={{ fontSize: '16px' }} />
              </span>
            </button>
            <button className="flex items-center justify-center rounded-full bg-white border border-gray-300 p-2 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:scale-105 transition-transform">
                <GoogleOutlined style={{ fontSize: '16px', color: '#DB4437' }} />
              </span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Bạn chưa có tài khoản? <Link to="/register" className="text-primary hover:underline font-medium transition-colors duration-300">Đăng ký tài khoản</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// const globalStyles = `
// @keyframes slow-zoom {
//   0% {
//     transform: scale(1);
//   }
//   100% {
//     transform: scale(1.05);
//   }
// }

// @keyframes fade-in {
//   0% {
//     opacity: 0;
//     transform: translateY(10px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-slow-zoom {
//   animation: slow-zoom 20s infinite alternate ease-in-out;
// }

// .animate-fade-in {
//   animation: fade-in 0.8s ease-out forwards;
// }

// .active\:scale-98:active {
//   transform: scale(0.98);
// }
// `;

export default LoginPage