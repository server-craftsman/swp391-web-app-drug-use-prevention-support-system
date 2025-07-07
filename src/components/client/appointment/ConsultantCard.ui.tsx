import React from "react";
import { Card, Avatar, Button, Rate, Tag } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";
import type { Consultant } from "../../../types/consultant/consultant.res.type";

interface ConsultantCardProps {
    consultant: Consultant;
    onBookAppointment: () => void;
    className?: string;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({
    consultant,
    onBookAppointment,
    className = ""
}) => {
    return (
        <Card
            className={`consultant-card hover:shadow-lg transition-all duration-300 ${className}`}
            cover={
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <Avatar
                        src={consultant.profilePicUrl || null}
                        size={80}
                        icon={<UserOutlined />}
                        className="border-4 border-white shadow-md"
                    />
                </div>
            }
            actions={[
                <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    onClick={() => onBookAppointment()}
                    className="bg-[#20558A] hover:bg-[#1a4a7a] border-none"
                >
                    Đặt lịch tư vấn
                </Button>
            ]}
        >
            <Card.Meta
                title={
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-[#20558A] mb-1">
                            {consultant.fullName}
                        </h3>
                        <Rate disabled defaultValue={5} className="text-sm" />
                    </div>
                }
                description={
                    <div className="space-y-2">
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {consultant.jobTitle || "Chuyên gia tư vấn với nhiều năm kinh nghiệm"}
                        </p>

                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-gray-500">
                                <MailOutlined className="w-3 h-3" />
                                <span>{consultant.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <PhoneOutlined className="w-3 h-3" />
                                <span>{consultant.phoneNumber}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                            <Tag color="blue" className="text-xs">Chuyên gia</Tag>
                            <Tag color="green" className="text-xs">Có sẵn</Tag>
                            <Tag color="orange" className="text-xs">Kinh nghiệm</Tag>
                        </div>
                    </div>
                }
            />
        </Card>
    );
};

export default ConsultantCard; 