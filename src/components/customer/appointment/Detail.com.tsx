import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Avatar, Rate, Form, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Appointment } from '../../../types/appointment/Appointment.res.type';
import { AppointmentStatus } from '../../../app/enums/appointmentStatus.enum';
import dayjs from 'dayjs';
import { helpers } from '../../../utils';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { ReviewService } from '../../../services/review/review.service';
import type { Review } from '../../../types/review/Review.res.type';
import { ConsultantService } from '../../../services/consultant/consultant.service';
import type { Consultant } from '../../../types/consultant/consultant.res.type';
import { useAuth } from '../../../contexts/Auth.context';
import type { UpdateReviewRequest } from '../../../types/review/Review.req.type';
import { UserRole } from '../../../app/enums/userRole.enum';

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
    const [editing, setEditing] = useState(false);
    const { userInfo, role } = useAuth();

    // Check if user can review/edit reviews
    const canReview = role !== UserRole.MANAGER && role !== UserRole.CONSULTANT;

    // Reset editing mode when review changes
    useEffect(() => {
        if (review && editing) {
            // If we have a review and we're in editing mode, 
            // make sure the form has the correct values
            reviewForm.setFieldsValue({ rating: review.rating, comment: review.comment });
        }
    }, [review, editing, reviewForm]);

    useEffect(() => {
        console.log('Editing state changed:', editing);
    }, [editing]);

    // Reset editing when submitting changes from true to false
    useEffect(() => {
        if (!submitting && editing) {
            // If we're not submitting anymore and still in editing mode,
            // check if we should stay in editing mode
            console.log('Submitting finished, checking if should stay in editing mode');
        }
    }, [submitting, editing]);

    useEffect(() => {
        if (appointmentId) {
            setReviewLoading(true);
            ReviewService.getReviewByAppointmentId(appointmentId)
                .then(res => {
                    // Xử lý response trả về array
                    const reviewData = res?.data?.data;

                    if (reviewData && Array.isArray(reviewData) && reviewData.length > 0) {
                        // Lưu trữ tất cả reviews
                        // setAllReviews(reviewData); // Removed

                        // Chọn review mới nhất (dựa trên createdAt)
                        const sortedReviews = reviewData.sort((a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                        const latestReview = sortedReviews[0];
                        setReview(latestReview);
                    } else if (reviewData && !Array.isArray(reviewData)) {
                        // Trường hợp data là object đơn lẻ
                        if (reviewData.rating !== undefined || reviewData.comment) {
                            // setAllReviews([reviewData]); // Removed
                            setReview(reviewData);
                        } else {
                            // setAllReviews([]); // Removed
                            setReview(null);
                        }
                    } else {
                        // setAllReviews([]); // Removed
                        setReview(null);
                    }
                })
                .catch(error => {
                    console.log(error)
                    setReview(null);
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
        if (!appointmentId || !userInfo?.id || !canReview) return;
        setSubmitting(true);
        try {
            const res = await ReviewService.reviewAppointment({
                appointmentId,
                userId: userInfo.id,
                rating: values.rating,
                comment: values.comment,
            });
            if (res?.data?.success) {
                const newReview = res.data.data;
                setReview(newReview);
                // setAllReviews(prev => [newReview, ...prev]); // Removed
                helpers.notificationMessage('Đánh giá thành công!', 'success');
            } else {
                helpers.notificationMessage('Đánh giá thất bại!', 'error');
            }
        } catch {
            helpers.notificationMessage('Đánh giá thất bại!', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = () => {
        if (review && canReview) {
            reviewForm.setFieldsValue({ rating: review.rating, comment: review.comment });
            setEditing(true);
        }
    };

    const handleDelete = async () => {
        if (!review || !review.id || !canReview) {
            helpers.notificationMessage('Không tìm thấy ID đánh giá!', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const res = await ReviewService.deleteReview({ id: review.id });
            if (res?.data?.success) {
                setReview(null);
                // setAllReviews(prev => prev.filter(r => r.id !== review.id)); // Removed
                reviewForm.resetFields();
                helpers.notificationMessage('Xóa đánh giá thành công!', 'success');
                setEditing(false);
            } else {
                helpers.notificationMessage('Xóa đánh giá thất bại!', 'error');
            }
        } catch {
            helpers.notificationMessage('Xóa đánh giá thất bại!', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (values: any) => {
        if (!review || !review.id || !canReview) {
            helpers.notificationMessage('Không tìm thấy ID đánh giá!', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const params: UpdateReviewRequest = {
                id: review.id,
                rating: values.rating,
                comment: values.comment,
            };
            const res = await ReviewService.updateReview(params);
            if (res?.data?.success && res.data.data) {
                const updatedReview = res.data.data;
                setReview(updatedReview);
                // setAllReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r)); // Removed
                setEditing(false);
                helpers.notificationMessage('Cập nhật đánh giá thành công!', 'success');
                setTimeout(() => setEditing(false), 100);
            } else {
                helpers.notificationMessage('Cập nhật đánh giá thất bại!', 'error');
                setTimeout(() => setEditing(false), 1000);
            }
        } catch (error) {
            helpers.notificationMessage('Cập nhật đánh giá thất bại!', 'error');
            setTimeout(() => setEditing(false), 1000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(false);
        reviewForm.resetFields();
        if (review) {
            reviewForm.setFieldsValue({ rating: review.rating, comment: review.comment });
        }
    };

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
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết lịch hẹn</h1>
                            <p className="text-gray-600">Xem thông tin chi tiết và đánh giá cuộc hẹn của bạn</p>
                        </div>
                        <Button
                            onClick={() => navigate(-1)}
                            type="default"
                            size="large"
                            className="shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            ← Quay lại
                        </Button>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card
                    className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white"
                    bodyStyle={{ padding: 0 }}
                >
                    {/* Appointment Details Section */}
                    <div className="bg-primary p-8 text-white">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Lịch hẹn</h2>
                                    <p className="text-blue-100 mt-1">
                                        {dayjs(appointment.appointmentTime).format('DD/MM/YYYY HH:mm')}
                                    </p>
                                </div>
                            </div>
                            <Tag
                                color={statusColorMap[appointment.status]}
                                className="px-4 py-2 text-base font-semibold rounded-full border-0"
                            >
                                {statusViMap[appointment.status]}
                            </Tag>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Customer Info */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                                            <p className="text-gray-800 font-medium">{appointment.name}</p>
                                        </div>
                                        {appointment.note && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                                                <p className="text-gray-800 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                                    {appointment.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Consultant Info */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                        Tư vấn viên
                                    </h3>
                                    {consultant ? (
                                        <div className="flex items-start gap-4">
                                            <Avatar
                                                src={consultant.profilePicUrl}
                                                size={64}
                                                className="border-4 border-white shadow-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 text-lg">{consultant.fullName}</h4>
                                                <p className="text-blue-600 font-medium mb-2">{consultant.jobTitle}</p>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <p className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        {consultant.email}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                        </svg>
                                                        {consultant.phoneNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                            </svg>
                                            <p>Chưa chỉ định tư vấn viên</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Review Section */}
                        {appointment.status === AppointmentStatus.COMPLETED && (
                            <div className="mt-12">
                                <div className="border-t pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Đánh giá cuộc hẹn</h3>
                                    </div>

                                    {reviewLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                <span className="text-lg">Đang tải đánh giá...</span>
                                            </div>
                                        </div>
                                    ) : review ? (
                                        editing && canReview ? (
                                            <div className="max-w-2xl">
                                                <Form
                                                    form={reviewForm}
                                                    layout="vertical"
                                                    onFinish={handleEditSubmit}
                                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200"
                                                >
                                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-blue-200">
                                                        <Avatar src={userInfo?.profilePicUrl} size={56} className="border-4 border-white shadow-lg" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 text-lg">{userInfo?.fullName || 'Bạn'}</h4>
                                                            <p className="text-gray-500 text-sm">
                                                                Chỉnh sửa đánh giá • {dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="primary"
                                                                icon={<SaveOutlined />}
                                                                htmlType="submit"
                                                                loading={submitting}
                                                                className="bg-green-600 hover:bg-green-700 border-0 shadow-lg"
                                                                size="large"
                                                            >
                                                                Lưu
                                                            </Button>
                                                            <Button
                                                                icon={<CloseOutlined />}
                                                                onClick={handleCancelEdit}
                                                                disabled={submitting}
                                                                size="large"
                                                                className="shadow-lg"
                                                            >
                                                                Hủy
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Form.Item
                                                        name="rating"
                                                        label={<span className="text-lg font-medium text-gray-700">Đánh giá sao</span>}
                                                        rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                                                    >
                                                        <Rate allowClear={false} style={{ fontSize: 28 }} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="comment"
                                                        label={<span className="text-lg font-medium text-gray-700">Nhận xét</span>}
                                                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                                                    >
                                                        <Input.TextArea
                                                            rows={4}
                                                            maxLength={300}
                                                            showCount
                                                            placeholder="Chia sẻ trải nghiệm của bạn về cuộc hẹn..."
                                                            className="text-base"
                                                        />
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        ) : (
                                            <div className="max-w-2xl">
                                                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <Avatar src={userInfo?.profilePicUrl} size={56} className="border-4 border-white shadow-lg" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 text-lg mb-2">{userInfo?.fullName || 'Bạn'}</h4>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Rate
                                                                    disabled
                                                                    value={review.rating || 0}
                                                                    style={{ fontSize: 24 }}
                                                                />
                                                                <span className="text-xl font-bold text-yellow-600">
                                                                    {review.rating || 0}/5
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">
                                                                {dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                                            </p>
                                                        </div>
                                                        {canReview && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="text"
                                                                    icon={<EditOutlined />}
                                                                    onClick={handleEdit}
                                                                    disabled={submitting}
                                                                    className="text-blue-600 hover:bg-blue-50"
                                                                    size="large"
                                                                />
                                                                <Popconfirm
                                                                    title="Bạn có chắc muốn xóa đánh giá này?"
                                                                    onConfirm={handleDelete}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                    okButtonProps={{ danger: true, loading: submitting }}
                                                                >
                                                                    <Button
                                                                        type="text"
                                                                        icon={<DeleteOutlined />}
                                                                        disabled={submitting}
                                                                        className="text-red-600 hover:bg-red-50"
                                                                        size="large"
                                                                    />
                                                                </Popconfirm>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
                                                        <p className="text-gray-800 text-lg leading-relaxed italic">
                                                            "{review.comment || 'Chưa có nhận xét'}"
                                                        </p>
                                                    </div>
                                                </Card>
                                            </div>
                                        )
                                    ) : (
                                        canReview && (
                                            <div className="max-w-2xl">
                                                <Form
                                                    form={reviewForm}
                                                    layout="vertical"
                                                    onFinish={handleReviewSubmit}
                                                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200"
                                                >
                                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-yellow-200">
                                                        <Avatar src={userInfo?.profilePicUrl} size={56} className="border-4 border-white shadow-lg" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800 text-lg">{userInfo?.fullName || 'Bạn'}</h4>
                                                            <p className="text-gray-600">Chia sẻ trải nghiệm của bạn</p>
                                                        </div>
                                                    </div>
                                                    <Form.Item
                                                        name="rating"
                                                        label={<span className="text-lg font-medium text-gray-700">Đánh giá sao</span>}
                                                        rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                                                    >
                                                        <Rate allowClear={false} style={{ fontSize: 28 }} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="comment"
                                                        label={<span className="text-lg font-medium text-gray-700">Nhận xét</span>}
                                                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                                                    >
                                                        <Input.TextArea
                                                            rows={4}
                                                            maxLength={300}
                                                            showCount
                                                            placeholder="Chia sẻ trải nghiệm của bạn về cuộc hẹn..."
                                                            className="text-base"
                                                        />
                                                    </Form.Item>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={submitting}
                                                        size="large"
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg px-8"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Gửi đánh giá
                                                    </Button>
                                                </Form>
                                            </div>
                                        )
                                    )}

                                    {!canReview && !review && (
                                        <div className="max-w-2xl">
                                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <h4 className="text-lg font-medium text-gray-700 mb-2">Chưa có đánh giá</h4>
                                                <p className="text-gray-500">Cuộc hẹn này chưa được đánh giá</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AppointmentDetail;