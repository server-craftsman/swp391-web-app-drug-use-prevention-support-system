import React from "react";
import { Row, Col, Steps } from "antd";
import { CalendarOutlined, MessageOutlined, CheckCircleOutlined } from "@ant-design/icons";

const ProcessSteps: React.FC = () => {
    const steps = [
        {
            icon: <CalendarOutlined className="text-2xl" />,
            title: "Đặt lịch hẹn",
            description: "Chọn ngày và giờ thuận tiện, điền thông tin liên hệ của bạn"
        },
        {
            icon: <MessageOutlined className="text-2xl" />,
            title: "Nhận xác nhận",
            description: "Chúng tôi sẽ xác nhận lịch hẹn và gửi thông tin chi tiết qua email/SMS"
        },
        {
            icon: <CheckCircleOutlined className="text-2xl" />,
            title: "Bắt đầu tư vấn",
            description: "Gặp gỡ chuyên gia vào thời gian đã hẹn và nhận được lời khuyên chuyên nghiệp"
        }
    ];

    return (
        <div className="process-steps py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
                        Quy trình đặt lịch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Chỉ với 3 bước đơn giản, bạn có thể đặt lịch tư vấn với chuyên gia
                        và bắt đầu nhận được sự hỗ trợ chuyên nghiệp.
                    </p>
                </div>

                {/* Desktop Steps */}
                <div className="hidden lg:block">
                    <Row gutter={[32, 32]} justify="center">
                        {steps.map((step, index) => (
                            <Col
                                key={index}
                                xs={24}
                                lg={8}
                                className="flex justify-center"
                            >
                                <div className="text-center max-w-xs">
                                    <div className="relative mb-6">
                                        <div className="w-16 h-16 bg-[#20558A] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                            {step.icon}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F4A261] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-8 left-full w-full h-0.5 bg-gray-300 hidden xl:block"></div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Mobile Steps */}
                <div className="lg:hidden flex justify-center">
                    <Steps
                        direction="vertical"
                        current={3}
                        className="process-steps-mobile"
                    >
                        {steps.map((step, index) => (
                            <Steps.Step
                                key={index}
                                icon={
                                    <div className="w-12 h-12 bg-[#20558A] rounded-full flex items-center justify-center text-white">
                                        {step.icon}
                                    </div>
                                }
                                title={<span className="text-lg font-semibold block text-center">{step.title}</span>}
                                description={
                                    <p className="text-gray-600 text-center mt-2">
                                        {step.description}
                                    </p>
                                }
                            />
                        ))}
                    </Steps>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-12 p-8 bg-gradient-to-r from-[#20558A] to-[#1a4a7a] rounded-lg text-white">
                    <h3 className="text-2xl font-bold mb-4">
                        Sẵn sàng bắt đầu?
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        Đừng chần chừ, hãy đặt lịch tư vấn ngay hôm nay và nhận được sự hỗ trợ tốt nhất.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProcessSteps; 