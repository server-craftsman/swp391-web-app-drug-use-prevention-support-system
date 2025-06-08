import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useRequestPasswordReset } from '../../../hooks'
import { ROUTER_URL } from '../../../consts/router.path.const'
import Background from '../../../assets/cover.jpg'

const ForgotPasswordPage = () => {
  const [form] = Form.useForm()
  const { mutate: requestPasswordReset, isPending, isSuccess } = useRequestPasswordReset()

  const handleSubmit = (values: { email: string }) => {
    requestPasswordReset(values)
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
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Quên mật khẩu</h2>
            </div>
          </Link>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mb-6 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Yêu cầu đã được gửi!</h3>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn. 
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
              </p>
              <Link 
                to={ROUTER_URL.AUTH.LOGIN}
                className="inline-block bg-primary hover:bg-[#0056b3] text-white py-3 px-6 rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-center">
                Nhập địa chỉ email bạn đã đăng ký và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
              </p>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-gray-400" />} 
                    placeholder="Email" 
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
                    Gửi yêu cầu
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
  )
}

export default ForgotPasswordPage 