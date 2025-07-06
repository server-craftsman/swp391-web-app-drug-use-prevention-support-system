import React from "react";
import { Button, Row, Col } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

interface HeroSectionProps {
    onBookNow: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookNow }) => {
    const features = [
        {
            icon: <CalendarOutlined className="text-2xl text-[#20558A]" />,
            title: "Đặt lịch dễ dàng",
            description: "Chọn thời gian phù hợp với lịch trình của bạn"
        },
        {
            icon: <UserOutlined className="text-2xl text-[#20558A]" />,
            title: "Chuyên gia giàu kinh nghiệm",
            description: "Đội ngũ tư vấn viên chuyên nghiệp và tận tâm"
        },
        {
            icon: <ClockCircleOutlined className="text-2xl text-[#20558A]" />,
            title: "Phản hồi nhanh chóng",
            description: "Hỗ trợ tư vấn kịp thời và hiệu quả"
        },
        {
            icon: <CheckCircleOutlined className="text-2xl text-[#20558A]" />,
            title: "Chất lượng đảm bảo",
            description: "Cam kết mang đến trải nghiệm tốt nhất"
        }
    ];

    return (
        <div className="hero-section bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
            <div className="container mx-auto px-4">
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="hero-content">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#20558A] mb-6 leading-tight">
                                Đặt lịch tư vấn
                                <br />
                                <span className="text-[#F4A261]">chuyên nghiệp</span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Kết nối với các chuyên gia hàng đầu để nhận được lời khuyên tốt nhất.
                                Đặt lịch tư vấn ngay hôm nay và bắt đầu hành trình thành công của bạn.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<CalendarOutlined />}
                                    onClick={onBookNow}
                                    className="bg-[#20558A] hover:bg-[#1a4a7a] border-none h-12 px-8 text-lg font-medium"
                                >
                                    Đặt lịch ngay
                                </Button>
                                <Button
                                    size="large"
                                    className="h-12 px-8 text-lg font-medium border-[#20558A] text-[#20558A] hover:bg-[#20558A] hover:text-white"
                                >
                                    Tìm hiểu thêm
                                </Button>
                            </div>

                            <div className="stats flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>1000+ khách hàng hài lòng</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>20+ chuyên gia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HeroSection; 