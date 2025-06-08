import { Link, useSearchParams } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { useVerifyEmailToken } from '../../../hooks';
import { ROUTER_URL } from '../../../consts/router.path.const';
import Background from '../../../assets/cover.jpg';

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { isLoading, isSuccess } = useVerifyEmailToken(token);

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
      
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-full max-w-md relative z-20 transition-all duration-700 hover:shadow-blue-900/20 animate-fade-in p-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Đang xác nhận email...</p>
          </div>
        ) : isSuccess ? (
          <Result
            status="success"
            title="Xác nhận email thành công!"
            subTitle="Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ."
            extra={
              <Link 
                to={ROUTER_URL.AUTH.LOGIN}
                className="inline-block bg-primary hover:bg-[#0056b3] text-white py-3 px-6 rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Đăng nhập
              </Link>
            }
          />
        ) : (
          <Result
            status="error"
            title="Xác nhận email thất bại"
            subTitle="Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ."
            extra={
              <div className="flex flex-col space-y-4">
                <Link 
                  to={ROUTER_URL.AUTH.LOGIN}
                  className="inline-block bg-primary hover:bg-[#0056b3] text-white py-3 px-6 rounded transition-all duration-300 font-medium hover:shadow-lg text-center"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/"
                  className="inline-block border border-gray-300 text-gray-700 py-3 px-6 rounded transition-all duration-300 font-medium hover:bg-gray-50 text-center"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage; 