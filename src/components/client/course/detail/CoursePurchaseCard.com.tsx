import React, { useState } from "react";
import { Card, Typography, Tag, Button, Divider, message } from "antd";
import { motion } from "framer-motion";
import {
    HeartOutlined,
    ShareAltOutlined,
    GiftOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    MobileOutlined,
    TrophyOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import type { Course } from "../../../../types/course/Course.res.type";
import { formatCurrency } from "../../../../utils/helper";
import AddToCartButton from "../../../common/addToCartButton.com";

const { Title, Text } = Typography;

interface CoursePurchaseCardProps {
    course: Course;
    highlights: string[];
}

const CoursePurchaseCard: React.FC<CoursePurchaseCardProps> = ({ course, highlights }) => {
    const [isLiked, setIsLiked] = useState(false);

    // Calculate final price and discount percentage
    const finalPrice = course.price - course.discount;
    const discountPercentage = course.discount > 0 ? Math.round((course.discount / course.price) * 100) : 0;

    const handleBuyNow = () => {
        message.success("Chuyển hướng đến trang thanh toán...");
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        message.success(isLiked ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success("Đã sao chép link khóa học!");
    };

    const handleGift = () => {
        message.info("Tính năng tặng khóa học sẽ sớm ra mắt!");
    };

    return (
        <div className="sticky top-6 z-[9998]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card
                    className="shadow-xl border-0 overflow-hidden"
                    style={{
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
                    }}
                    bodyStyle={{ padding: 0 }}
                >
                    {/* Course Image */}
                    <div className="relative">
                        <img
                            src={course.imageUrl}
                            alt={course.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                            }}
                        />
                        {discountPercentage > 0 && (
                            <div className="absolute top-4 right-4">
                                <Tag color="red" className="text-sm font-bold px-3 py-1 rounded-full">
                                    -{discountPercentage}%
                                </Tag>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Price Section */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center space-x-3">
                                <Text className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(finalPrice)}
                                </Text>
                                {course.discount > 0 && (
                                    <Text delete className="text-gray-400 text-lg">
                                        {formatCurrency(course.price)}
                                    </Text>
                                )}
                            </div>
                            {course.discount > 0 && (
                                <Text className="text-red-500 text-sm font-medium">
                                    Tiết kiệm {formatCurrency(course.discount)}
                                </Text>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-6">
                            <AddToCartButton courseId={course.id} />

                            <Button
                                type="default"
                                size="large"
                                block
                                className="h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl"
                                onClick={handleBuyNow}
                            >
                                Mua ngay
                            </Button>
                        </div>

                        {/* Money Back Guarantee */}
                        <div className="text-center mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                            <CheckCircleOutlined className="text-green-600 text-lg mr-2" />
                            <Text className="text-green-700 font-medium">
                                Đảm bảo hoàn tiền trong 30 ngày
                            </Text>
                        </div>

                        {/* Course Highlights */}
                        <div className="mb-6">
                            <Title level={5} className="mb-3 text-gray-800">
                                Khóa học này bao gồm:
                            </Title>
                            <div className="space-y-2">
                                {highlights.map((highlight, index) => {
                                    const icons = [
                                        <ClockCircleOutlined key="clock" className="text-blue-600" />,
                                        <PlayCircleOutlined key="play" className="text-green-600" />,
                                        <MobileOutlined key="mobile" className="text-purple-600" />,
                                        <TrophyOutlined key="trophy" className="text-yellow-600" />
                                    ];

                                    return (
                                        <div key={index} className="flex items-center space-x-3">
                                            {icons[index % icons.length]}
                                            <Text className="text-gray-700">{highlight}</Text>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Divider className="my-4" />

                        {/* Secondary Actions */}
                        <div className="flex space-x-2">
                            <Button
                                icon={<HeartOutlined />}
                                className={`flex-1 border-gray-300 ${isLiked ? 'text-red-500 border-red-400' : 'hover:border-red-400 hover:text-red-500'}`}
                                onClick={handleLike}
                            >
                                Yêu thích
                            </Button>
                            <Button
                                icon={<ShareAltOutlined />}
                                className="flex-1 border-gray-300 hover:border-blue-400 hover:text-blue-500"
                                onClick={handleShare}
                            >
                                Chia sẻ
                            </Button>
                            <Button
                                icon={<GiftOutlined />}
                                className="flex-1 border-gray-300 hover:border-orange-400 hover:text-orange-500"
                                onClick={handleGift}
                            >
                                Tặng
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default CoursePurchaseCard; 