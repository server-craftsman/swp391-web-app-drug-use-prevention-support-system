import React from "react";
import { Typography, Button, Card } from "antd";
import { CommentOutlined, UserOutlined, MessageOutlined, LikeOutlined } from "@ant-design/icons";
import type { Program } from "../../../../types/program/Program.type";

const { Title } = Typography;

interface ProgramDiscussionTabProps {
    program: Program;
}

const ProgramDiscussionTab: React.FC<ProgramDiscussionTabProps> = ({ program }) => {
    return (
        <div style={{ padding: '32px' }}>
            <Title level={3} style={{
                color: '#2d3748',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 600
            }}>
                Thảo luận: {program.name}
            </Title>

            {/* Discussion Forum Coming Soon */}
            <Card style={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                padding: '48px 24px',
                backgroundColor: '#fafafa'
            }}>
                <div style={{ color: '#718096' }}>
                    {/* Forum Icon */}
                    <div style={{
                        width: '96px',
                        height: '96px',
                        backgroundColor: '#e6f7ff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        position: 'relative'
                    }}>
                        <CommentOutlined style={{
                            fontSize: '48px',
                            color: '#20558A'
                        }} />
                        {/* Additional icons for community feel */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '15px',
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#52c41a',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <UserOutlined style={{ fontSize: '12px', color: '#fff' }} />
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '15px',
                            left: '10px',
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#1890ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MessageOutlined style={{ fontSize: '10px', color: '#fff' }} />
                        </div>
                    </div>

                    <Title level={4} style={{
                        color: '#2d3748',
                        marginBottom: '16px',
                        fontWeight: 600,
                        fontSize: '20px'
                    }}>
                        Diễn đàn thảo luận
                    </Title>

                    <p style={{
                        color: '#718096',
                        margin: '0 0 32px 0',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        maxWidth: '480px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Tham gia thảo luận với các học viên khác về chương trình này.
                        Chia sẻ kinh nghiệm, đặt câu hỏi và kết nối với cộng đồng học tập.
                    </p>

                    {/* Feature Preview Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'left'
                        }}>
                            <MessageOutlined style={{
                                fontSize: '24px',
                                color: '#20558A',
                                marginBottom: '12px'
                            }} />
                            <div style={{
                                fontWeight: 600,
                                color: '#2d3748',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                Thảo luận chung
                            </div>
                            <div style={{ fontSize: '13px', color: '#718096' }}>
                                Trao đổi về nội dung chương trình
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'left'
                        }}>
                            <UserOutlined style={{
                                fontSize: '24px',
                                color: '#52c41a',
                                marginBottom: '12px'
                            }} />
                            <div style={{
                                fontWeight: 600,
                                color: '#2d3748',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                Kết nối học viên
                            </div>
                            <div style={{ fontSize: '13px', color: '#718096' }}>
                                Tìm hiểu và kết nối với bạn học
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'left'
                        }}>
                            <LikeOutlined style={{
                                fontSize: '24px',
                                color: '#f56565',
                                marginBottom: '12px'
                            }} />
                            <div style={{
                                fontWeight: 600,
                                color: '#2d3748',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                Đánh giá & Phản hồi
                            </div>
                            <div style={{ fontSize: '13px', color: '#718096' }}>
                                Chia sẻ trải nghiệm học tập
                            </div>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        style={{
                            backgroundColor: '#20558A',
                            borderColor: '#20558A',
                            borderRadius: '8px',
                            fontWeight: 600,
                            height: '48px',
                            padding: '0 32px',
                            fontSize: '16px'
                        }}
                    >
                        Tham gia thảo luận
                    </Button>

                    <div style={{
                        marginTop: '24px',
                        fontSize: '14px',
                        color: '#a0aec0'
                    }}>
                        Tính năng sẽ sớm ra mắt • Đang trong quá trình phát triển
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProgramDiscussionTab; 