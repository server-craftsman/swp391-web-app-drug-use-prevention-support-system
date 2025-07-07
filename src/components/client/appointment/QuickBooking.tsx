import React, { useState, useEffect } from "react";
import { Card, Button, Form, Input, DatePicker, message, Select } from "antd";
import { CalendarOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface QuickBookingProps {
    onBookingSubmit: (data: any) => void;
    className?: string;
}

const QuickBooking: React.FC<QuickBookingProps> = ({ onBookingSubmit, className = "" }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const availableTimes = [
        "08:30", "09:30", "10:30", "13:30", "14:30", "15:30", "16:30", "18:00", "19:00"
    ];

    useEffect(() => {
        try {
            const raw = localStorage.getItem("useInfo");
            if (raw) {
                const info = JSON.parse(raw);
                form.setFieldsValue({
                    name: `${info.firstName ?? ""} ${info.lastName ?? ""}`.trim(),
                    phone: info.phoneNumber,
                    address: info.address,
                });
            }
        } catch { }
    }, [form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const appointmentData = {
                ...values,
                appointmentTime: dayjs(values.selectedDate)
                    .hour(parseInt(values.selectedTime.split(':')[0]))
                    .minute(parseInt(values.selectedTime.split(':')[1]))
                    .toISOString(),
            };

            await onBookingSubmit(appointmentData);
            message.success("Đặt lịch nhanh thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
            form.resetFields();
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <Card
            className={`quick-booking-card ${className}`}
            title={
                <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-[#20558A]" />
                    <span className="text-[#20558A] font-bold">Đặt lịch nhanh</span>
                </div>
            }
            bordered={false}
            bodyStyle={{ padding: '24px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập họ tên của bạn"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                    <Input
                        placeholder="0123456789"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                >
                    <Input placeholder="Địa chỉ của bạn" size="large" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="selectedDate"
                        label="Ngày"
                        rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                    >
                        <DatePicker
                            className="w-full"
                            disabledDate={disabledDate}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày"
                            size="large"
                            prefix={<CalendarOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="selectedTime"
                        label="Giờ"
                        rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                    >
                        <Select
                            placeholder="Chọn giờ"
                            size="large"
                        >
                            {availableTimes.map((time) => (
                                <Select.Option key={time} value={time}>
                                    <ClockCircleOutlined /> {time}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="note"
                    label="Ghi chú (tuỳ chọn)"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Mô tả ngắn gọn nhu cầu tư vấn..."
                        maxLength={200}
                        showCount
                    />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    className="bg-[#20558A] hover:bg-[#1a4a7a] border-none h-12 text-lg font-medium"
                    icon={<CalendarOutlined />}
                >
                    Đặt lịch ngay
                </Button>

                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                        * Chúng tôi sẽ xác nhận lịch hẹn trong vòng 2 giờ
                    </p>
                </div>
            </Form>
        </Card>
    );
};

export default QuickBooking; 