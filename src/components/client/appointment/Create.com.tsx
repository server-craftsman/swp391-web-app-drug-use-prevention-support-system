import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button, Select } from "antd";
import { UserOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { AppointmentService } from "../../../services/appointment/appointment.service";
import type { CreateAppointmentRequest } from "../../../types/appointment/Appointment.req.type";
import { helpers } from "../../../utils";
interface CreateAppointmentProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

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

const CreateAppointmentModal: React.FC<CreateAppointmentProps> = ({
    visible,
    onCancel,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
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
        }
    }, [visible, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const appointmentTime = dayjs(values.selectedDate)
                .hour(parseInt(values.selectedTime.split(':')[0]))
                .minute(parseInt(values.selectedTime.split(':')[1]))
                .toISOString();

            const requestData: CreateAppointmentRequest = {
                appointmentTime,
                note: values.note || '',
                name: values.name,
                phone: values.phone,
                address: values.address || '',
            };

            await AppointmentService.createAppointment(requestData);
            helpers.notificationMessage("Đặt lịch hẹn thành công!", "success");
            form.resetFields();
            onSuccess();
        } catch (err) {
            helpers.notificationMessage("Đặt lịch hẹn thất bại. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        // Disable dates before today
        return current && current < dayjs().startOf('day');
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-[#20558A]" />
                    <span className="text-[#20558A] font-semibold">Đặt lịch tư vấn</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            className="booking-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
            >
                {/* Thông tin cá nhân */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <UserOutlined /> Thông tin liên hệ
                    </h4>

                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                    >
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                        <Input placeholder="0123456789" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        <Input placeholder="Địa chỉ của bạn" />
                    </Form.Item>
                </div>

                {/* Chọn ngày và giờ */}
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="selectedDate"
                        label="Chọn ngày"
                        rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                    >
                        <DatePicker
                            className="w-full"
                            disabledDate={disabledDate}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày"
                        />
                    </Form.Item>

                    <Form.Item
                        name="selectedTime"
                        label="Chọn giờ"
                        rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                    >
                        <Select placeholder="Chọn khung giờ">
                            {availableTimes.map((time) => (
                                <Select.Option key={time} value={time}>
                                    <ClockCircleOutlined /> {time}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* Ghi chú */}
                <Form.Item
                    name="note"
                    label="Nội dung tư vấn (tuỳ chọn)"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Nhập nội dung bạn cần tư vấn..."
                    />
                </Form.Item>

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-[#20558A] hover:bg-[#1a4a7a]"
                    >
                        Đặt lịch ngay
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateAppointmentModal;
