import React from "react";
import { Typography, Row, Col, Card, Tag, Rate } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";
import AddToCartButton from "../../../common/addToCartButton.com";

const { Text, Paragraph } = Typography;

interface CourseHeroProps {
    course: Course;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
    const finalPrice = course.price - course.discount;
    const discountPercentage = course.discount > 0 ? Math.round((course.discount / course.price) * 100) : 0;

    const getTargetAudienceLabel = (audience: string) => {
        const map: Record<string, string> = {
            'student': 'Học sinh',
            'teacher': 'Giáo viên',
            'parent': 'Phụ huynh'
        };
        return map[audience] || audience;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Không xác định";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto">
                <Row gutter={[32, 24]}>
                    <Col xs={24} lg={16}>
                        {/* Breadcrumb */}
                        <div className="mb-3">
                            <Text className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">
                                Phòng chống ma túy
                            </Text>
                            <Text className="text-gray-500 mx-2">›</Text>
                            <Text className="text-gray-400 text-sm">{getTargetAudienceLabel(course.targetAudience)}</Text>
                        </div>
                        {/* Course Title */}
                        <h1
                            className="text-white mb-4 text-6xl font-bold leading-tight"
                            style={{
                                color: 'white',
                                margin: '0 0 16px 0'
                            }}
                        >
                            {course.name}
                        </h1>

                        {/* Course Description */}
                        <Paragraph className="text-gray-300 text-lg mb-4 leading-relaxed line-clamp-3">
                            {course.content}
                        </Paragraph>

                        {/* Course Stats */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center">
                                <Rate disabled defaultValue={5} className="text-yellow-400 text-sm mr-2" />
                                <Text className="text-yellow-400 font-bold mr-2">4.8</Text>
                                <Text className="text-blue-400 underline cursor-pointer text-sm">(1,234 đánh giá)</Text>
                            </div>
                            <Text className="text-gray-300 text-sm">2,345 học viên</Text>
                        </div>

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center">
                                <Text className="mr-2 text-white">Được tạo bởi</Text>
                                <Text className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300">
                                    Huy Nguyen
                                </Text>
                            </div>
                            <div className="flex items-center">
                                <CalendarOutlined className="mr-1" />
                                Cập nhật {formatDate(course.createdAt)}
                            </div>
                            <div className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                Tiếng Việt
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <div className="lg:hidden">
                            <Card className="bg-white/10 backdrop-blur-sm border-0" style={{ borderRadius: 12 }}>
                                <div className="text-center">
                                    <div className="mb-4">
                                        {course.discount > 0 ? (
                                            <div>
                                                <Text className="text-2xl font-bold text-white block">
                                                    {formatCurrency(finalPrice)}
                                                </Text>
                                                <Text delete className="text-gray-400">
                                                    {formatCurrency(course.price)}
                                                </Text>
                                                <Tag color="red" className="ml-2">-{discountPercentage}%</Tag>
                                            </div>
                                        ) : (
                                            <Text className="text-2xl font-bold text-white">
                                                {formatCurrency(course.price)}
                                            </Text>
                                        )}
                                    </div>
                                    <AddToCartButton courseId={course.id} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CourseHero; 