import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Tag, Avatar, Rate, Form, Input, message, Popconfirm } from 'antd';
import type { Appointment } from '../../../types/appointment/Appointment.res.type';
import { AppointmentStatus } from '../../../app/enums/appointmentStatus.enum';
import dayjs from 'dayjs';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { ReviewService } from '../../../services/review/review.service';
import type { Review } from '../../../types/review/Review.res.type';
import { ConsultantService } from '../../../services/consultant/consultant.service';
import type { Consultant } from '../../../types/consultant/consultant.res.type';
import { useAuth } from '../../../contexts/Auth.context';
// import type { UpdateReviewRequest } from '../../../types/review/Review.req.type';

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

    const [review, setReview] = useState<Review | null>(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [consultant, setConsultant] = useState<Consultant | null>(null);
    const [reviewForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    // const [editing, setEditing] = useState(false);
    const { userInfo } = useAuth();

    useEffect(() => {
        if (appointmentId) {
            setReviewLoading(true);
            ReviewService.getReviewByAppointmentId(appointmentId)
                .then(res => {
                    if (res?.data?.success && res.data.data) {
                        setReview(res.data.data);
                    }
                })
                .finally(() => setReviewLoading(false));
        }
    }, [appointmentId]);

    useEffect(() => {
        const consultantId = (appointment?.consultant as any)?.id;
        if (consultantId) {
            ConsultantService.getConsultantById({ id: consultantId })
                .then(res => {
                    if (res?.data?.success && res.data.data) {
                        setConsultant(res.data.data);
                    }
                });
        }
    }, [appointment]);

    const handleReviewSubmit = async (values: any) => {
        if (!appointmentId || !userInfo?.id) return;
        setSubmitting(true);
        try {
            const res = await ReviewService.reviewAppointment({
                appointmentId,
                userId: userInfo.id,
                rating: values.rating,
                comment: values.comment,
            });
            if (res?.data?.success) {
                setReview(res.data.data);
                message.success('Đánh giá thành công!');
            } else {
                message.error('Đánh giá thất bại!');
            }
        } catch {
            message.error('Đánh giá thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = () => {
        if (review) {
            reviewForm.setFieldsValue({ rating: review.rating, comment: review.comment });
            // setEditing(true);
        }
    };

    const handleDelete = async () => {
        if (!review || !review.id) {
            message.error('Không tìm thấy ID đánh giá!');
            return;
        }
        setSubmitting(true);
        try {
            const res = await ReviewService.deleteReview({ id: review.id });
            if (res?.data?.success) {
                setReview(null);
                reviewForm.resetFields();
                message.success('Xóa đánh giá thành công!');
                // setEditing(false);
            } else {
                message.error('Xóa đánh giá thất bại!');
            }
        } catch {
            message.error('Xóa đánh giá thất bại!');
        } finally {
            setSubmitting(false);
        }
    };

    // const handleEditSubmit = async (values: any) => {
    //     if (!review || !review.id) {
    //         message.error('Không tìm thấy ID đánh giá!');
    //         return;
    //     }
    //     setSubmitting(true);
    //     try {
    //         const params: UpdateReviewRequest = {
    //             id: review.id,
    //             rating: values.rating,
    //             comment: values.comment,
    //         };
    //         const res = await ReviewService.updateReview(params);
    //         if (res?.data?.success && res.data.data) {
    //             setReview(res.data.data); // Chỉ set nếu có data
    //             setEditing(false);
    //             message.success('Cập nhật đánh giá thành công!');
    //         } else {
    //             message.error('Cập nhật đánh giá thất bại!');
    //         }
    //     } catch {
    //         message.error('Cập nhật đánh giá thất bại!');
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

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
                        {consultant ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar src={consultant.profilePicUrl} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{consultant.fullName}</div>
                                    <div style={{ color: '#888' }}>{consultant.email}</div>
                                    <div style={{ color: '#888' }}>{consultant.phoneNumber}</div>
                                    <div style={{ color: '#888' }}>{consultant.jobTitle}</div>
                                </div>
                            </div>
                        ) : (
                            (appointment.consultant as any)?.fullName || (appointment.consultant as any)?.name || 'Chưa chỉ định'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusColorMap[appointment.status]}>{statusViMap[appointment.status]}</Tag>
                    </Descriptions.Item>
                    {appointment.note && (
                        <Descriptions.Item label="Ghi chú">{appointment.note}</Descriptions.Item>
                    )}
                </Descriptions>

                {/* Review Section */}
                <div style={{ marginTop: 32 }}>
                    <h3 className="text-lg font-semibold mb-2">Đánh giá cuộc hẹn</h3>
                    {appointment.status === AppointmentStatus.COMPLETED ? (
                        reviewLoading ? (
                            <div>Đang tải đánh giá...</div>
                        ) : review ? (
                            <Card bordered style={{ maxWidth: 500, borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar src={userInfo?.profilePicUrl} size={48} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{userInfo?.fullName || 'Bạn'}</div>
                                        <Rate disabled value={review.rating} style={{ fontSize: 18 }} />
                                        <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 500 }}>{review.rating}/5</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, color: '#333', fontSize: 15, fontStyle: 'italic' }}>
                                    “{review.comment}”
                                </div>
                                <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
                                    {dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                </div>
                                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                    <Button onClick={handleEdit} disabled={submitting}>Sửa</Button>
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa đánh giá này?"
                                        onConfirm={handleDelete}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                        okButtonProps={{ danger: true, loading: submitting }}
                                    >
                                        <Button danger disabled={submitting}>Xóa</Button>
                                    </Popconfirm>
                                </div>
                            </Card>
                        ) : (
                            <Form
                                form={reviewForm}
                                layout="vertical"
                                onFinish={handleReviewSubmit}
                                style={{ maxWidth: 500, background: '#fafafa', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2' }}
                            >
                                <Form.Item
                                    name="rating"
                                    label="Đánh giá (sao)"
                                    rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                                >
                                    <Rate allowClear={false} />
                                </Form.Item>
                                <Form.Item
                                    name="comment"
                                    label="Nhận xét"
                                    rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                                >
                                    <Input.TextArea rows={3} maxLength={300} showCount placeholder="Nhận xét về cuộc hẹn..." />
                                </Form.Item>
                                <Button type="primary" className='bg-primary' htmlType="submit" loading={submitting}>
                                    Gửi đánh giá
                                </Button>
                            </Form>
                        )
                    ) : null}
                </div>
            </Card>
        </div>
    );
};

export default AppointmentDetail;