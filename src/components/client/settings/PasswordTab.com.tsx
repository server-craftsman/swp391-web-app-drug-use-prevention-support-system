import React from 'react';
import { Card, Form, Input, Button, Divider } from 'antd';
import { helpers } from '../../../utils';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { AuthService } from '../../../services/auth/auth.service';
import { useAuth } from '../../../contexts/Auth.context';

interface PasswordTabProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const PasswordTab: React.FC<PasswordTabProps> = ({ loading, setLoading }) => {
    const [passwordForm] = Form.useForm();
    const { logout } = useAuth();

    // Handle password change
    const handlePasswordChange = async (values: ChangePasswordRequest) => {
        setLoading(true);
        try {
            const response = await AuthService.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            if (response?.data?.success) {
                helpers.notificationMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');
                passwordForm.resetFields();
                setTimeout(() => {
                    logout();
                }, 1500);
            } else {
                helpers.notificationMessage('Đổi mật khẩu thất bại!', 'error');
            }
        } catch (error) {
            helpers.notificationMessage('Đổi mật khẩu thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <Card className="shadow-sm">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LockOutlined className="text-2xl text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Đổi mật khẩu</h3>
                        <p className="text-gray-600 mt-2">Bảo mật tài khoản của bạn bằng mật khẩu mạnh</p>
                    </div>

                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập mật khẩu hiện tại"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập mật khẩu mới"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Xác nhận mật khẩu mới"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={<LockOutlined />}
                                className="w-full bg-primary hover:bg-secondary"
                            >
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider />

                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Gợi ý mật khẩu mạnh:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Ít nhất 8 ký tự</li>
                            <li>• Bao gồm chữ hoa và chữ thường</li>
                            <li>• Có số và ký tự đặc biệt</li>
                            <li>• Không sử dụng thông tin cá nhân</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default PasswordTab; 