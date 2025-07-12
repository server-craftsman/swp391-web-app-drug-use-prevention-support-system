import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, Avatar, Select, DatePicker, Row, Col } from 'antd';
import { UserOutlined, CameraOutlined, SaveOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/Auth.context';
import { UserService } from '../../../services/user/user.service';
import { BaseService } from '../../../app/api/base.service';
import { LocationService } from '../../../services/location.service';
import type { Province, District, Ward } from '../../../services/location.service';
import type { UpdateUserRequest } from '../../../types/user/User.req.type';
import { helpers } from '../../../utils';
import dayjs from 'dayjs';

const { Option } = Select;

interface ProfileTabProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ loading, setLoading }) => {
    const { userInfo, setUserInfo } = useAuth();
    const [profileForm] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(userInfo?.profilePicUrl || '');

    // Location states
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | undefined>(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<District | undefined>(undefined);
    const [selectedWard, setSelectedWard] = useState<Ward | undefined>(undefined);
    const [locationLoading, setLocationLoading] = useState(false);

    // Load provinces on component mount
    useEffect(() => {
        loadProvinces();
    }, []);

    // Refresh form data when userInfo changes
    useEffect(() => {
        if (userInfo) {
            profileForm.setFieldsValue({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                gender: userInfo.gender,
                dob: userInfo.dob ? dayjs(userInfo.dob) : null,
            });
            setAvatarUrl(userInfo.profilePicUrl || '');
        }
        console.log("userInfo after update: ", userInfo);
    }, [userInfo, profileForm]);

    const loadProvinces = async () => {
        setLocationLoading(true);
        try {
            const provincesData = await LocationService.getProvinces();
            setProvinces(provincesData);
        } catch (error) {
            helpers.notificationMessage('Không thể tải danh sách tỉnh thành!', 'error');
        } finally {
            setLocationLoading(false);
        }
    };

    const handleProvinceChange = async (provinceCode: string) => {
        const province = provinces.find(p => p.code === provinceCode);
        setSelectedProvince(province);
        setSelectedDistrict(undefined);
        setSelectedWard(undefined);
        setDistricts([]);
        setWards([]);

        // Clear district and ward in form
        profileForm.setFieldsValue({
            district: undefined,
            ward: undefined
        });

        if (province) {
            setLocationLoading(true);
            try {
                const districtsData = await LocationService.getDistricts(provinceCode);
                setDistricts(districtsData);
            } catch (error) {
                helpers.notificationMessage('Không thể tải danh sách quận huyện!', 'error');
            } finally {
                setLocationLoading(false);
            }
        }
    };

    const handleDistrictChange = async (districtCode: string) => {
        const district = districts.find(d => d.code === districtCode);
        setSelectedDistrict(district);
        setSelectedWard(undefined);
        setWards([]);

        // Clear ward in form
        profileForm.setFieldsValue({
            ward: undefined
        });

        if (district) {
            setLocationLoading(true);
            try {
                const wardsData = await LocationService.getWards(districtCode);
                setWards(wardsData);
            } catch (error) {
                helpers.notificationMessage('Không thể tải danh sách phường xã!', 'error');
            } finally {
                setLocationLoading(false);
            }
        }
    };

    const handleWardChange = (wardCode: string) => {
        const ward = wards.find(w => w.code === wardCode);
        setSelectedWard(ward);
    };

    // Handle profile picture upload
    const handleAvatarUpload = async (file: File) => {
        setUploading(true);
        try {
            const uploadedUrl = await BaseService.uploadFile(file);
            if (uploadedUrl) {
                setAvatarUrl(uploadedUrl);
                helpers.notificationMessage('Ảnh đại diện đã được tải lên thành công!', 'success');
            }
        } catch (error) {
            helpers.notificationMessage('Tải lên ảnh đại diện thất bại!', 'error');
        } finally {
            setUploading(false);
        }
    };

    // Handle profile update
    const handleProfileUpdate = async (values: any) => {
        setLoading(true);
        try {
            // Build complete address from location components and detailed address
            const fullAddress = LocationService.formatFullAddress(
                values.addressDetails || '',
                selectedWard,
                selectedDistrict,
                selectedProvince
            );

            const updateData: UpdateUserRequest = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                address: fullAddress,
                gender: values.gender,
                dob: values.dob.format('YYYY-MM-DD'),
                profilePicUrl: avatarUrl,
            };

            const response = await UserService.updateUser(updateData);

            if (response?.data?.success) {
                // Update userInfo in context and localStorage
                const updatedUserInfo = { ...userInfo, ...response.data.data };
                setUserInfo(updatedUserInfo);
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

                // Refresh form with updated data
                profileForm.setFieldsValue({
                    firstName: updatedUserInfo.firstName,
                    lastName: updatedUserInfo.lastName,
                    email: updatedUserInfo.email,
                    phoneNumber: updatedUserInfo.phoneNumber,
                    gender: updatedUserInfo.gender,
                    dob: updatedUserInfo.dob ? dayjs(updatedUserInfo.dob) : null,
                });

                // Update avatar URL
                setAvatarUrl(updatedUserInfo.profilePicUrl || '');

                helpers.notificationMessage('Cập nhật hồ sơ thành công!', 'success');
            }
        } catch (error) {
            helpers.notificationMessage('Cập nhật hồ sơ thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="shadow-sm">
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <Avatar
                            size={120}
                            src={avatarUrl}
                            icon={!avatarUrl && <UserOutlined />}
                            className="shadow-lg"
                        />
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                handleAvatarUpload(file);
                                return false;
                            }}
                        >
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<CameraOutlined />}
                                loading={uploading}
                                className="absolute bottom-0 right-0 shadow-lg"
                                size="large"
                            />
                        </Upload>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </h3>
                    <p className="text-gray-600">{userInfo?.email}</p>
                </div>

                <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileUpdate}
                    initialValues={{
                        firstName: userInfo?.firstName,
                        lastName: userInfo?.lastName,
                        email: userInfo?.email,
                        phoneNumber: userInfo?.phoneNumber,
                        gender: userInfo?.gender,
                        dob: userInfo?.dob ? dayjs(userInfo.dob) : null,
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Họ"
                                name="firstName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input size="large" placeholder="Nhập họ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Tên"
                                name="lastName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input size="large" placeholder="Nhập tên" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input size="large" placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input size="large" placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select size="large" placeholder="Chọn giới tính">
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày sinh"
                                name="dob"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                            >
                                <DatePicker
                                    size="large"
                                    placeholder="Chọn ngày sinh"
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Address Section */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="flex items-center text-lg font-medium text-gray-800 mb-4">
                            <EnvironmentOutlined className="mr-2 text-blue-500" />
                            Địa chỉ
                        </h4>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Tỉnh/Thành phố"
                                    name="province"
                                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Chọn tỉnh/thành phố"
                                        loading={locationLoading}
                                        onChange={handleProvinceChange}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {provinces.map(province => (
                                            <Option key={province.code} value={province.code}>
                                                {province.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Quận/Huyện"
                                    name="district"
                                    rules={[{ required: true, message: 'Vui lòng chọn quận huyện!' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Chọn quận/huyện"
                                        loading={locationLoading}
                                        onChange={handleDistrictChange}
                                        disabled={!selectedProvince}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {districts.map(district => (
                                            <Option key={district.code} value={district.code}>
                                                {district.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Phường/Xã"
                                    name="ward"
                                    rules={[{ required: true, message: 'Vui lòng chọn phường xã!' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Chọn phường/xã"
                                        loading={locationLoading}
                                        onChange={handleWardChange}
                                        disabled={!selectedDistrict}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {wards.map(ward => (
                                            <Option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Địa chỉ chi tiết"
                            name="addressDetails"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
                        >
                            <Input.TextArea
                                size="large"
                                placeholder="Nhập số nhà, tên đường, địa chỉ chi tiết..."
                                rows={3}
                                showCount
                                maxLength={200}
                            />
                        </Form.Item>

                        {/* Address Preview */}
                        {(selectedProvince || selectedDistrict || selectedWard) && (
                            <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ:</p>
                                <p className="text-blue-800">
                                    {LocationService.formatFullAddress(
                                        profileForm.getFieldValue('addressDetails') || '[Địa chỉ chi tiết]',
                                        selectedWard,
                                        selectedDistrict,
                                        selectedProvince
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            icon={<SaveOutlined />}
                            className="w-full bg-primary hover:bg-secondary"
                        >
                            Cập nhật hồ sơ
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </motion.div>
    );
};

export default ProfileTab; 