import React from "react";
import { Row, Col, Statistic, Card } from "antd";
import { UserOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const AppointmentStats: React.FC = () => {
    const stats = [
        {
            title: "Tổng lượt đặt lịch",
            value: 1234,
            prefix: <CalendarOutlined className="text-[#20558A]" />,
            suffix: "+",
            color: "#20558A"
        },
        {
            title: "Khách hàng hài lòng",
            value: 98.5,
            prefix: <CheckCircleOutlined className="text-green-500" />,
            suffix: "%",
            color: "#52c41a"
        },
        {
            title: "Chuyên gia tư vấn",
            value: 25,
            prefix: <UserOutlined className="text-[#F4A261]" />,
            suffix: "+",
            color: "#F4A261"
        },
        {
            title: "Thời gian phản hồi",
            value: 2,
            prefix: <ClockCircleOutlined className="text-blue-500" />,
            suffix: "h",
            color: "#1890ff"
        }
    ];

    return (
        <div className="appointment-stats py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
                        Thống kê dịch vụ
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Những con số ấn tượng thể hiện chất lượng dịch vụ và sự tin tưởng từ khách hàng
                    </p>
                </div>

                <Row gutter={[24, 24]}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card
                                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                                bodyStyle={{ padding: '24px' }}
                            >
                                <Statistic
                                    title={
                                        <span className="text-gray-600 font-medium text-sm">
                                            {stat.title}
                                        </span>
                                    }
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    suffix={
                                        <span style={{ color: stat.color }} className="font-bold">
                                            {stat.suffix}
                                        </span>
                                    }
                                    valueStyle={{
                                        color: stat.color,
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default AppointmentStats; 