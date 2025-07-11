import React, { useState } from "react";
import { Typography, Row, Col, Button, Card, Tag } from "antd";
import { ExpandAltOutlined, CompressOutlined, ClockCircleOutlined, EnvironmentOutlined, TagOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Program } from "../../../../types/program/Program.type";

const { Title, Paragraph } = Typography;

interface ProgramOverviewTabProps {
    program: Program;
}

const ProgramOverviewTab: React.FC<ProgramOverviewTabProps> = ({ program }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Truncate description để hiển thị ngắn gọn
    const truncateText = (text: string, maxLength: number = 250) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const durationDays = dayjs(program.endDate).diff(dayjs(program.startDate), 'day') + 1;

    return (
        <div style={{ padding: '32px' }}>
            {/* Program Description Section */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={3} style={{
                    color: '#2d3748',
                    marginBottom: '20px',
                    fontSize: '24px',
                    fontWeight: 600
                }}>
                    Về chương trình này
                </Title>

                <div style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#4a5568',
                    marginBottom: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <Paragraph style={{
                        margin: 0,
                        color: '#4a5568',
                        fontSize: '16px',
                        lineHeight: '1.7'
                    }}>
                        <div dangerouslySetInnerHTML={{
                            __html: isDescriptionExpanded
                                ? program.description ?? ""
                                : truncateText(program.description?.replace(/<[^>]*>/g, '') ?? "", 250)
                        }} />
                    </Paragraph>
                </div>

                {/* Expand/Collapse Button */}
                {(program.description?.length ?? 0) > 250 && (
                    <Button
                        type="link"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        icon={isDescriptionExpanded ? <CompressOutlined /> : <ExpandAltOutlined />}
                        style={{
                            padding: '0 0 8px 0',
                            color: '#20558A',
                            fontWeight: 600,
                            fontSize: '14px',
                            height: 'auto'
                        }}
                    >
                        {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                )}
            </div>

            {/* Program Details Card */}
            <Card
                title={
                    <Title level={4} style={{
                        margin: 0,
                        color: '#2d3748',
                        fontSize: '18px',
                        fontWeight: 600
                    }}>
                        Chi tiết chương trình
                    </Title>
                }
                style={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                headStyle={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    borderRadius: '12px 12px 0 0'
                }}
                bodyStyle={{ padding: '24px' }}
            >
                <Row gutter={[32, 24]}>
                    <Col xs={24} md={12}>
                        {/* Location */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <EnvironmentOutlined style={{
                                fontSize: '18px',
                                color: '#20558A',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Địa điểm
                                </div>
                                <div style={{ color: '#4a5568', fontSize: '15px' }}>
                                    {program.location}
                                </div>
                            </div>
                        </div>

                        {/* Type */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <TagOutlined style={{
                                fontSize: '18px',
                                color: '#20558A',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Loại chương trình
                                </div>
                                <Tag color="blue" style={{
                                    margin: 0,
                                    padding: '4px 12px',
                                    fontSize: '13px',
                                    borderRadius: '6px'
                                }}>
                                    {program.type}
                                </Tag>
                            </div>
                        </div>

                        {/* Risk Level */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <ExclamationCircleOutlined style={{
                                fontSize: '18px',
                                color: '#f56565',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Mức độ rủi ro
                                </div>
                                <Tag color="orange" style={{
                                    margin: 0,
                                    padding: '4px 12px',
                                    fontSize: '13px',
                                    borderRadius: '6px'
                                }}>
                                    {program.riskLevel}
                                </Tag>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        {/* Start Date */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                        }}>
                            <ClockCircleOutlined style={{
                                fontSize: '18px',
                                color: '#0284c7',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Ngày bắt đầu
                                </div>
                                <div style={{ color: '#0284c7', fontSize: '15px', fontWeight: 500 }}>
                                    {dayjs(program.startDate).format('DD/MM/YYYY')}
                                </div>
                            </div>
                        </div>

                        {/* End Date */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            padding: '16px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd'
                        }}>
                            <ClockCircleOutlined style={{
                                fontSize: '18px',
                                color: '#0284c7',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Ngày kết thúc
                                </div>
                                <div style={{ color: '#0284c7', fontSize: '15px', fontWeight: 500 }}>
                                    {dayjs(program.endDate).format('DD/MM/YYYY')}
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '16px',
                            backgroundColor: '#ecfdf5',
                            borderRadius: '8px',
                            border: '1px solid #a7f3d0'
                        }}>
                            <ClockCircleOutlined style={{
                                fontSize: '18px',
                                color: '#059669',
                                marginRight: '12px',
                                marginTop: '2px'
                            }} />
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2d3748',
                                    fontSize: '14px',
                                    marginBottom: '4px'
                                }}>
                                    Thời lượng
                                </div>
                                <div style={{ color: '#059669', fontSize: '15px', fontWeight: 500 }}>
                                    {durationDays} ngày
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProgramOverviewTab; 