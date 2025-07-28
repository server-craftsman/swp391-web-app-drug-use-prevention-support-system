import React from "react";
import { Drawer, Image, Tag, Card, Typography, Space } from "antd";
import { CalendarOutlined, EnvironmentOutlined, VideoCameraOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { Program } from "../../../types/program/Program.type";
import { ProgramType } from "../../../app/enums/programType.enum";
import { helpers } from "../../../utils";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";

const { Title, Text } = Typography;

interface DetailProps {
    visible: boolean;
    onClose: () => void;
    program?: Program | null;
}

const riskLabels: Record<RiskLevel, string> = {
    [RiskLevel.NONE]: "Không rủi ro",
    [RiskLevel.LOW]: "Thấp",
    [RiskLevel.MEDIUM]: "Trung bình",
    [RiskLevel.HIGH]: "Cao",
    [RiskLevel.VERY_HIGH]: "Rất cao",
};

const ProgramDetailDrawer: React.FC<DetailProps> = ({ visible, onClose, program }) => {
    const getRiskLevelConfig = (riskLevel: RiskLevel) => {
        const configs = {
            [RiskLevel.NONE]: { color: 'green', icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            [RiskLevel.LOW]: { color: 'blue', icon: '🔵', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            [RiskLevel.MEDIUM]: { color: 'gold', icon: '🟡', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            [RiskLevel.HIGH]: { color: 'orange', icon: '🟠', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
            [RiskLevel.VERY_HIGH]: { color: 'red', icon: '🔴', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
        };
        return configs[riskLevel] || configs[RiskLevel.NONE];
    };

    const getProgramTypeConfig = (type: ProgramType) => {
        const configs = {
            [ProgramType.COMMUNICATION]: { color: 'green', icon: '💬', label: 'Truyền thông' },
            [ProgramType.TRAINING]: { color: 'blue', icon: '📚', label: 'Đào tạo' },
            [ProgramType.COUNSELING]: { color: 'purple', icon: '💬', label: 'Tư vấn' },
        };
        return configs[type] || { color: 'default', icon: '📋', label: type };
    };

    return (
        <Drawer 
            title={
                <div className="flex items-center gap-3">
                    
                    <div>
                        <Title level={4} className="!mb-0 !text-gray-800">Chi tiết chương trình</Title>
                        <Text type="secondary" className="text-sm">Thông tin chi tiết về chương trình</Text>
                    </div>
                </div>
            }
            width={1200} 
            open={visible} 
            onClose={onClose} 
            destroyOnClose
            className="program-detail-drawer"
            styles={{
                header: {
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '20px 24px'
                },
                body: {
                    padding: '24px',
                    background: '#fafafa'
                }
            }}
        >
            {program && (
                <div className="space-y-6">
                    {/* Hero Section with Image and Title */}
                    <Card className="shadow-lg border-0 overflow-hidden">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="relative overflow-hidden rounded-xl shadow-md">
                                    <Image 
                                        src={program.programImgUrl} 
                                        width={250} 
                                        height={180}
                                        className="object-cover"
                                        style={{ borderRadius: '12px' }}
                                        placeholder={
                                            <div className="w-[250px] h-[180px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                    <Text type="secondary">Không có ảnh</Text>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <Title level={2} className="!mb-4 !text-gray-800">{program.name}</Title>
                                <Space direction="vertical" size="middle" className="w-full">
                                    <div className="flex items-center gap-3">
                                        <EnvironmentOutlined className="text-blue-500 text-lg" />
                                        <Text strong className="text-gray-700">{program.location}</Text>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const typeConfig = getProgramTypeConfig(program.type as ProgramType);
                                            return (
                                                <>
                                                    <span className="text-lg">{typeConfig.icon}</span>
                                                    <Tag color={typeConfig.color} className="px-3 py-1 rounded-full border-0 font-medium">
                                                        {typeConfig.label}
                                                    </Tag>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ExclamationCircleOutlined className="text-orange-500 text-lg" />
                                        {(() => {
                                            const riskConfig = getRiskLevelConfig(program.riskLevel as RiskLevel);
                                            return (
                                                <Tag color={riskConfig.color} className="px-3 py-1 rounded-full border-0 font-medium">
                                                    <span className="mr-1">{riskConfig.icon}</span>
                                                    {riskLabels[program.riskLevel as RiskLevel]}
                                                </Tag>
                                            );
                                        })()}
                                    </div>
                                </Space>
                            </div>
                        </div>
                    </Card>

                    {/* Description Section */}
                    <Card title={
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📝</span>
                            <Text strong>Mô tả chương trình</Text>
                        </div>
                    } className="shadow-sm">
                        <div className="prose max-w-none">
                            {program.description ? (
                                <div 
                                    dangerouslySetInnerHTML={{ __html: program.description }} 
                                    className="text-gray-700 leading-relaxed"
                                />
                            ) : (
                                <Text type="secondary" italic>Chưa có mô tả cho chương trình này</Text>
                            )}
                        </div>
                    </Card>

                    {/* Timeline Section */}
                    <Card title={
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-blue-500" />
                            <Text strong>Thời gian thực hiện</Text>
                        </div>
                    } className="shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <Text type="secondary" className="block mb-1">Ngày bắt đầu</Text>
                                <Text strong className="text-green-700 text-lg">
                                    {helpers.formatDate(new Date(program.startDate))}
                                </Text>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <Text type="secondary" className="block mb-1">Ngày kết thúc</Text>
                                <Text strong className="text-red-700 text-lg">
                                    {helpers.formatDate(new Date(program.endDate))}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Video Section */}
                    <Card title={
                        <div className="flex items-center gap-2">
                            <VideoCameraOutlined className="text-purple-500" />
                            <Text strong>Video giới thiệu</Text>
                        </div>
                    } className="shadow-sm">
                        {program.programVidUrl ? (
                            <div className="relative overflow-hidden rounded-xl shadow-lg bg-black">
                                <video
                                    controls
                                    width="100%"
                                    height={400}
                                    style={{ 
                                        objectFit: 'contain', 
                                        backgroundColor: '#000',
                                        borderRadius: '12px'
                                    }}
                                    playsInline
                                    crossOrigin="anonymous"
                                    poster={program.programImgUrl}
                                    className="w-full"
                                >
                                    <source src={program.programVidUrl} />
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <VideoCameraOutlined className="text-4xl text-gray-400 mb-4" />
                                <Text type="secondary" className="text-lg">Chưa có video cho chương trình này</Text>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </Drawer>
    );
};

export default ProgramDetailDrawer;
