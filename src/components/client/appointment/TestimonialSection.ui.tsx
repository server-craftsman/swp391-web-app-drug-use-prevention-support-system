import React from "react";
import { Row, Col, Card, Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";

const TestimonialSection: React.FC = () => {
    const testimonials = [
        {
            id: 1,
            name: "Nguyễn Thị Mai",
            position: "Khách hàng",
            avatar: "",
            rating: 5,
            comment: "Dịch vụ tư vấn rất chuyên nghiệp và tận tâm. Chuyên gia đã giúp tôi giải quyết vấn đề một cách hiệu quả. Tôi sẽ giới thiệu cho bạn bè và đồng nghiệp.",
            date: "2 tuần trước"
        },
        {
            id: 2,
            name: "Trần Văn Nam",
            position: "Doanh nhân",
            avatar: "",
            rating: 5,
            comment: "Quy trình đặt lịch rất đơn giản và thuận tiện. Chuyên gia có kinh nghiệm phong phú và đưa ra lời khuyên thiết thực. Rất hài lòng với dịch vụ!",
            date: "1 tháng trước"
        },
        {
            id: 3,
            name: "Lê Thị Hoa",
            position: "Giáo viên",
            avatar: "",
            rating: 5,
            comment: "Tôi đã nhận được sự hỗ trợ tuyệt vời từ đội ngũ tư vấn. Họ luôn lắng nghe và đưa ra giải pháp phù hợp. Chắc chắn sẽ quay lại sử dụng dịch vụ.",
            date: "3 tuần trước"
        }
    ];

    return (
        <div className="testimonial-section py-16 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
                        Khách hàng nói gì về chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Những phản hồi chân thật từ khách hàng đã sử dụng dịch vụ tư vấn của chúng tôi
                    </p>
                </div>

                <Row gutter={[24, 24]}>
                    {testimonials.map((testimonial) => (
                        <Col xs={24} md={8} key={testimonial.id}>
                            <Card
                                className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                bodyStyle={{ padding: '24px' }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Rating */}
                                    <div className="mb-4">
                                        <Rate disabled value={testimonial.rating} className="text-[#F4A261]" />
                                    </div>

                                    {/* Comment */}
                                    <div className="flex-1 mb-6">
                                        <p className="text-gray-700 italic leading-relaxed">
                                            "{testimonial.comment}"
                                        </p>
                                    </div>

                                    {/* Author Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={testimonial.avatar || null}
                                                size={50}
                                                icon={<UserOutlined />}
                                                className="bg-[#20558A]"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {testimonial.position}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">
                                                {testimonial.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Overall Rating */}
                <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-[#20558A] mb-2">4.9/5</h3>
                    <Rate disabled value={5} className="text-[#F4A261] mb-3" />
                    <p className="text-gray-600">
                        Dựa trên <span className="font-semibold">500+ đánh giá</span> từ khách hàng
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection; 