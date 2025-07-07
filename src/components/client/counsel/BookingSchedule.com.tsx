import { useState } from "react";
import { Form, Input, DatePicker, Select, Button, message, Card, Row, Col } from "antd";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, HomeOutlined, MessageOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { AppointmentService } from "../../../services/appointment/appointment.service";
import type { CreateAppointmentRequest } from "../../../types/appointment/Appointment.req.type";

// Khung giờ có sẵn
const availableTimes = [
    "08:30",
    "09:30",
    "10:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "18:00",
    "19:00",
];

// Dịch vụ tư vấn
const consultingServices = [
    "Tư vấn học tập",
    "Tư vấn định hướng nghề nghiệp",
    "Tư vấn du học",
    "Tư vấn kỹ năng mềm",
    "Tư vấn tâm lý",
    "Tư vấn khác"
];

export default function BookingSchedule() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const appointmentTime = dayjs(values.selectedDate)
                .hour(parseInt(values.selectedTime.split(':')[0]))
                .minute(parseInt(values.selectedTime.split(':')[1]))
                .toISOString();

            const requestData: CreateAppointmentRequest = {
                appointmentTime,
                note: `${values.serviceType ? `Loại dịch vụ: ${values.serviceType}\n` : ''}${values.note || ''}`,
                name: values.name,
                phone: values.phone,
                address: values.address || '',
            };

            await AppointmentService.createAppointment(requestData);
            message.success("Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
            form.resetFields();
        } catch (err) {
            message.error("Đặt lịch hẹn thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        // Disable dates before today
        return current && current < dayjs().startOf('day');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#20558A] to-[#4f35e2] rounded-full mb-6">
                        <CalendarOutlined className="text-3xl text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-[#20558A] to-[#4f35e2] bg-clip-text text-transparent mb-4">
                        Đặt lịch tư vấn
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Hãy để chúng tôi đồng hành cùng bạn trên con đường phát triển bản thân.
                        Đặt lịch ngay để nhận được sự tư vấn chuyên nghiệp nhất.
                    </p>
                </div>

                {/* Features */}
                <Row gutter={[24, 24]} className="mb-12">
                    <Col xs={24} md={8}>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TeamOutlined className="text-2xl text-[#20558A]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Đội ngũ chuyên gia</h3>
                            <p className="text-gray-600 text-sm">Tư vấn viên giàu kinh nghiệm, chuyên môn cao</p>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClockCircleOutlined className="text-2xl text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Linh hoạt thời gian</h3>
                            <p className="text-gray-600 text-sm">Đa dạng khung giờ phù hợp với lịch trình của bạn</p>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageOutlined className="text-2xl text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tư vấn cá nhân hóa</h3>
                            <p className="text-gray-600 text-sm">Giải pháp phù hợp cho từng nhu cầu riêng biệt</p>
                        </div>
                    </Col>
                </Row>

                {/* Booking Form */}
                <Card
                    className="shadow-2xl border-0 overflow-hidden"
                    style={{ borderRadius: '24px' }}
                >
                    <div className="bg-gradient-to-r from-[#20558A] to-[#4f35e2] p-8 -m-6 mb-6">
                        <div className="text-center text-white">
                            <CalendarOutlined className="text-4xl mb-3" />
                            <h2 className="text-3xl font-bold mb-2">
                                Thông tin đặt lịch
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
                            </p>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        size="large"
                        className="mt-6"
                    >
                        <Row gutter={[24, 16]}>
                            {/* Thông tin cá nhân */}
                            <Col span={24}>
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#20558A] rounded-full flex items-center justify-center">
                                            <UserOutlined className="text-white" />
                                        </div>
                                        Thông tin liên hệ
                                    </h3>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="name"
                                                label="Họ và tên"
                                                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined className="text-gray-400" />}
                                                    placeholder="Nguyễn Văn A"
                                                    className="rounded-xl"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="phone"
                                                label="Số điện thoại"
                                                rules={[
                                                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                                                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }
                                                ]}
                                            >
                                                <Input
                                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                                    placeholder="0123456789"
                                                    className="rounded-xl"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                name="address"
                                                label="Địa chỉ"
                                            >
                                                <Input
                                                    prefix={<HomeOutlined className="text-gray-400" />}
                                                    placeholder="Địa chỉ của bạn"
                                                    className="rounded-xl"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            {/* Dịch vụ tư vấn */}
                            <Col span={24}>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                            <TeamOutlined className="text-white" />
                                        </div>
                                        Loại hình tư vấn
                                    </h3>

                                    <Form.Item
                                        name="serviceType"
                                        label="Chọn dịch vụ tư vấn"
                                        rules={[{ required: true, message: "Vui lòng chọn loại dịch vụ!" }]}
                                    >
                                        <Select
                                            placeholder="-- Chọn dịch vụ tư vấn --"
                                            className="rounded-xl"
                                        >
                                            {consultingServices.map((service) => (
                                                <Select.Option key={service} value={service}>
                                                    {service}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Col>

                            {/* Thời gian */}
                            <Col span={24}>
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                            <CalendarOutlined className="text-white" />
                                        </div>
                                        Thời gian tư vấn
                                    </h3>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="selectedDate"
                                                label="Chọn ngày"
                                                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                                            >
                                                <DatePicker
                                                    className="w-full rounded-xl"
                                                    disabledDate={disabledDate}
                                                    format="DD/MM/YYYY"
                                                    placeholder="Chọn ngày tư vấn"
                                                    suffixIcon={<CalendarOutlined />}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="selectedTime"
                                                label="Chọn khung giờ"
                                                rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                                            >
                                                <Select
                                                    placeholder="Chọn khung giờ"
                                                    suffixIcon={<ClockCircleOutlined />}
                                                    className="rounded-xl"
                                                >
                                                    {availableTimes.map((time) => (
                                                        <Select.Option key={time} value={time}>
                                                            <ClockCircleOutlined className="mr-2" />
                                                            {time} - {(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:{time.split(':')[1]}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            {/* Ghi chú */}
                            <Col span={24}>
                                <Form.Item
                                    name="note"
                                    label={
                                        <span className="flex items-center gap-2 text-lg font-medium">
                                            <MessageOutlined className="text-[#20558A]" />
                                            Nội dung cần tư vấn
                                        </span>
                                    }
                                >
                                    <Input.TextArea
                                        rows={5}
                                        placeholder="Mô tả chi tiết về vấn đề bạn cần tư vấn, mục tiêu bạn muốn đạt được, hoặc bất kỳ thông tin nào bạn muốn chia sẻ..."
                                        showCount
                                        maxLength={1000}
                                        className="rounded-xl"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Lưu ý */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-6 rounded-2xl mb-8">
                            <h4 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                                ⚠️ Lưu ý quan trọng
                            </h4>
                            <Row gutter={[16, 8]}>
                                <Col xs={24} md={12}>
                                    <ul className="text-sm text-yellow-700 space-y-2">
                                        <li>• Vui lòng có mặt đúng giờ đã đặt</li>
                                        <li>• Buổi tư vấn kéo dài khoảng 60 phút</li>
                                        <li>• Chuẩn bị sẵn các câu hỏi cần tư vấn</li>
                                    </ul>
                                </Col>
                                <Col xs={24} md={12}>
                                    <ul className="text-sm text-yellow-700 space-y-2">
                                        <li>• Chúng tôi sẽ xác nhận trong vòng 2 giờ</li>
                                        <li>• Thay đổi lịch hẹn trước 24 giờ</li>
                                        <li>• Hoàn toàn miễn phí và bảo mật</li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>

                        {/* Submit button */}
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-[#20558A] to-[#4f35e2] border-0 hover:from-[#1a4a7a] hover:to-[#3f2bbf]"
                                style={{ borderRadius: '16px' }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⚡</span>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <CalendarOutlined />
                                        Đặt lịch tư vấn ngay
                                    </span>
                                )}
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Contact info */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Cần hỗ trợ thêm?</h4>
                            <Row gutter={[24, 16]} className="text-sm">
                                <Col xs={24} md={8}>
                                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <PhoneOutlined className="text-[#20558A]" />
                                        <span>Hotline: 1900-xxxx</span>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <span>📧</span>
                                        <span>support@company.com</span>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <span>💬</span>
                                        <span>Chat hỗ trợ 24/7</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
