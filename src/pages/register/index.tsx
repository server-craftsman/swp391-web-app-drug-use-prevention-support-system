import { Link } from 'react-router-dom'
import { FacebookFilled, TwitterOutlined, GoogleOutlined } from '@ant-design/icons'
import Background from '../../assets/cover.jpg'

const RegisterPage = () => {
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
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-[#0056b3] border-l-[80px] border-l-transparent"></div>
        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#0056b3] border-r-[80px] border-r-transparent"></div>
        
        <div className="px-10 pt-14 pb-10">
          <Link to="/" className="transition-transform hover:scale-105 duration-300 block">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-2">PDP</h1>
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Đăng ký tài khoản</h2>
            </div>
          </Link>
          
          <form>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="group">
                <input 
                  type="text" 
                  placeholder="Họ" 
                  className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                  required
                />
              </div>
              <div className="group">
                <input 
                  type="text" 
                  placeholder="Tên" 
                  className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 group">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
              />
            </div>
            
            <div className="mb-4 group">
              <input 
                type="tel" 
                placeholder="Số điện thoại" 
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
              />
            </div>
            
            <div className="mb-4 group">
              <select 
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
              >
                <option value="" disabled selected>Nhóm đối tượng</option>
                <option value="student">Học sinh</option>
                <option value="university">Sinh viên</option>
                <option value="parent">Phụ huynh</option>
                <option value="teacher">Giáo viên</option>
                <option value="other">Khác</option>
              </select>
            </div>
            
            <div className="mb-4 group">
              <input 
                type="password" 
                placeholder="Mật khẩu" 
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
              />
            </div>
            
            <div className="mb-6 group">
              <input 
                type="password" 
                placeholder="Xác nhận mật khẩu" 
                className="w-full bg-gray-100/80 border-0 rounded px-4 py-3 text-gray-700 focus:outline-none transition-all duration-300 focus:shadow-md group-hover:bg-gray-100"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center group">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-primary transition-colors duration-300 rounded" 
                  required 
                />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với <a href="#" className="text-primary hover:underline transition-colors duration-300">điều khoản sử dụng</a> và <a href="#" className="text-primary hover:underline transition-colors duration-300">chính sách bảo mật</a>
                </span>
              </label>
            </div>
            
            <div className="flex justify-center mb-6">
              <button 
                type="submit" 
                className="bg-primary hover:bg-[#0056b3] text-white py-3 px-10 rounded transition-all duration-300 font-medium hover:shadow-lg hover:shadow-red-600/30 active:scale-98"
              >
                Đăng ký
              </button>
            </div>
          </form>
          
          <div className="text-center mb-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600 text-sm">Hoặc đăng ký bằng</span>
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
              Đã có tài khoản? <Link to="/login" className="text-primary hover:underline font-medium transition-colors duration-300">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage