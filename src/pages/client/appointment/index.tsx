import React, { useState } from "react";
import { Button, FloatButton, Row, Col } from "antd";
import { CalendarOutlined, WhatsAppOutlined, PhoneOutlined } from "@ant-design/icons";
import HeroSection from "../../../components/client/appointment/HeroSection";
import ConsultantShowcase from "../../../components/client/appointment/ConsultantShowcase.com";
import ProcessSteps from "../../../components/client/appointment/ProcessSteps.ui";
import AppointmentStats from "../../../components/client/appointment/AppointmentStats.ui";
import TestimonialSection from "../../../components/client/appointment/TestimonialSection.ui";
import QuickBooking from "../../../components/client/appointment/QuickBooking";
import CreateAppointmentModal from "../../../components/client/appointment/Create.com";
import { AppointmentService } from "../../../services/appointment/appointment.service";

const AppointmentPage: React.FC = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const handleBookNow = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        // You could add success handling here like showing a success page or refreshing data
    };

    const handleQuickBooking = async (data: any) => {
        try {
            await AppointmentService.createAppointment({
                appointmentTime: data.appointmentTime,
                note: data.note || '',
                name: data.name,
                phone: data.phone,
                address: data.address || '',
            });
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="appointment-page">
            {/* Hero Section */}
            <HeroSection onBookNow={handleBookNow} />

            {/* Quick Booking + Stats Section */}
            <div className="quick-booking-stats-section py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} lg={12}>
                            <QuickBooking
                                onBookingSubmit={handleQuickBooking}
                                className="shadow-xl"
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-6">
                                    Đặt lịch trong
                                    <br />
                                    <span className="text-[#F4A261]">60 giây</span>
                                </h2>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    Không cần tài khoản, không cần chờ đợi. Chỉ cần điền thông tin
                                    và chọn thời gian phù hợp. Chúng tôi sẽ xác nhận lịch hẹn ngay lập tức.
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Xác nhận tức thì</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Không mất phí</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Linh hoạt thời gian</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Hỗ trợ 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Process Steps */}
            <ProcessSteps />

            {/* Appointment Statistics */}
            <AppointmentStats />

            {/* Consultant Showcase */}
            <ConsultantShowcase onBookAppointment={handleBookNow} />

            {/* Testimonials */}
            <TestimonialSection />

            {/* Additional CTA Section */}
            <div className="cta-section py-16 bg-gradient-to-br from-[#20558A] to-[#1a4a7a]">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Bạn có câu hỏi?
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
                            Hãy đặt lịch tư vấn hoặc liên hệ trực tiếp để được giải đáp mọi thắc mắc.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                onClick={handleBookNow}
                                className="bg-[#F4A261] hover:bg-[#e6926a] border-none h-12 px-8 text-lg font-medium"
                            >
                                Đặt lịch tư vấn
                            </Button>
                            <Button
                                size="large"
                                icon={<PhoneOutlined />}
                                className="h-12 px-8 text-lg font-medium border-white text-white hover:bg-white hover:text-[#20558A]"
                            >
                                Gọi ngay: 1900-xxxx
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ or Additional Info Section */}
            <div className="info-section py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
                            Tại sao chọn chúng tôi?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#20558A] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                🎯
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Chuyên nghiệp</h3>
                            <p className="text-gray-600">
                                Đội ngũ chuyên gia giàu kinh nghiệm, được đào tạo bài bản và
                                luôn cập nhật kiến thức mới nhất.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#20558A] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                ⚡
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Nhanh chóng</h3>
                            <p className="text-gray-600">
                                Quy trình đặt lịch đơn giản, phản hồi nhanh chóng và
                                hỗ trợ khách hàng 24/7.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#20558A] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                💎
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Chất lượng</h3>
                            <p className="text-gray-600">
                                Cam kết mang đến dịch vụ chất lượng cao, tư vấn chính xác
                                và giải pháp phù hợp nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{ right: 24 }}
                icon={<CalendarOutlined />}
            >
                <FloatButton
                    icon={<CalendarOutlined />}
                    tooltip="Đặt lịch ngay"
                    onClick={handleBookNow}
                />
                <FloatButton
                    icon={<WhatsAppOutlined />}
                    tooltip="Chat WhatsApp"
                />
                <FloatButton
                    icon={<PhoneOutlined />}
                    tooltip="Gọi điện"
                />
            </FloatButton.Group>

            {/* Create Appointment Modal */}
            <CreateAppointmentModal
                visible={isCreateModalVisible}
                onCancel={handleCreateModalClose}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default AppointmentPage;
