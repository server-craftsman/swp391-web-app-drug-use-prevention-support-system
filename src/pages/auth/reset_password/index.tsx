import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useResetPassword } from '../../../hooks';
import { ROUTER_URL } from '../../../consts/router.path.const';
import Background from '../../../assets/cover.jpg';

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = (values: { NewPassword: string }) => {
    if (!token || !email) return;
    
    resetPassword({
      token,
      email,
      NewPassword: values.NewPassword
    });
  };

  if (!token || !email) {
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
          <Result
            status="error"
            title="Liên kết không hợp lệ"
            subTitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
            extra={
              <Link 
                to={ROUTER_URL.AUTH.FORGOT_PASSWORD}
                className="inline-block bg-primary hover:bg-[#0056b3] text-white py-3 px-6 rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Yêu cầu liên kết mới
              </Link>
            }
          />
        </div>
      </div>
    );
  }

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
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">PDP</h1>
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Đặt lại mật khẩu</h2>
            </div>
          </Link>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mb-6 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Mật khẩu đã được đặt lại!</h3>
              <p className="text-gray-600 mb-6">
                Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
              </p>
              <Link 
                to={ROUTER_URL.AUTH.LOGIN}
                className="inline-block bg-primary hover:bg-[#0056b3] text-white py-3 px-6 rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
              </p>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="NewPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-gray-400" />} 
                    placeholder="Mật khẩu mới" 
                    size="large"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={['NewPassword']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('NewPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-gray-400" />} 
                    placeholder="Xác nhận mật khẩu" 
                    size="large"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item className="mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-primary hover:bg-[#0056b3] text-white rounded transition-all duration-300 font-medium hover:shadow-lg"
                    loading={isPending}
                  >
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  <Link to={ROUTER_URL.AUTH.LOGIN} className="text-primary hover:underline font-medium transition-colors duration-300">
                    Quay lại đăng nhập
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 