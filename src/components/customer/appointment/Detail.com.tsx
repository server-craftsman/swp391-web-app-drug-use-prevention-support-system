import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag } from 'antd';
import type { Appointment } from '../../../types/appointment/Appointment.res.type';
import { AppointmentStatus } from '../../../app/enums/appointmentStatus.enum';
import dayjs from 'dayjs';
import { ROUTER_URL } from '../../../consts/router.path.const';

const statusColorMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: 'orange',
    [AppointmentStatus.CONFIRMED]: 'blue',
    [AppointmentStatus.ASSIGNED]: 'purple',
    [AppointmentStatus.PROCESSING]: 'cyan',
    [AppointmentStatus.COMPLETED]: 'green',
    [AppointmentStatus.CANCELLED]: 'red',
};

const statusViMap: Record<string, string> = {
    [AppointmentStatus.PENDING]: 'Đang chờ',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.ASSIGNED]: 'Đã được giao',
    [AppointmentStatus.PROCESSING]: 'Đang xử lý',
    [AppointmentStatus.COMPLETED]: 'Đã hoàn thành',
    [AppointmentStatus.CANCELLED]: 'Đã hủy',
};

const AppointmentDetail: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const appointment = (location.state as any)?.appointment as Appointment | undefined;

    if (!appointment) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Không tìm thấy thông tin lịch hẹn</h2>
                <Button type="primary" onClick={() => navigate(ROUTER_URL.CUSTOMER.APPOINTMENTS)}>
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <Card title={`Chi tiết lịch hẹn #${appointmentId}`}
                extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Khách hàng">{appointment.name}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian hẹn">
                        {dayjs(appointment.appointmentTime).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tư vấn viên">
                        {(appointment.consultant as any)?.fullName || (appointment.consultant as any)?.name || 'Chưa chỉ định'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusColorMap[appointment.status]}>{statusViMap[appointment.status]}</Tag>
                    </Descriptions.Item>
                    {appointment.note && (
                        <Descriptions.Item label="Ghi chú">{appointment.note}</Descriptions.Item>
                    )}
                </Descriptions>
            </Card>
        </div>
    );
};

export default AppointmentDetail;