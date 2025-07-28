import React, { useState } from "react";
import { Typography, Button, Card, message } from "antd";
import { DownloadOutlined, PlayCircleOutlined, FileOutlined, LoadingOutlined } from "@ant-design/icons";
import type { Program } from "../../../../types/program/Program.type";

const { Title } = Typography;

interface ProgramDownloadsTabProps {
    program: Program;
}

const ProgramDownloadsTab: React.FC<ProgramDownloadsTabProps> = ({ program }) => {
    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleVideoDownload = async () => {
        // Kiểm tra xem có URL video không, nếu không có thì thoát luôn
        if (!program.programVidUrl) return;

        // Bật trạng thái loading để hiển thị spinner
        setDownloadLoading(true);
        try {
            // Hiển thị thông báo cho người dùng biết đang chuẩn bị tải
            message.info('Đang chuẩn bị tải video...');

            // Gửi HTTP request để lấy video từ URL
            // fetch() trả về một Promise chứa response
            const response = await fetch(program.programVidUrl);
            
            // Kiểm tra xem request có thành công không (status 200-299)
            if (!response.ok) throw new Error('Không thể tải video');

            // Chuyển response thành blob (binary data) để có thể download
            // blob là dạng dữ liệu nhị phân, phù hợp cho file video
            const blob = await response.blob();
            
            // Tạo một URL tạm thời từ blob data trong bộ nhớ trình duyệt
            const url = window.URL.createObjectURL(blob);

            // Tạo một thẻ <a> ảo để kích hoạt việc download
            const link = document.createElement('a');
            link.href = url; // Gán URL tạm thời vào href
            
            // Tạo tên file download, thay thế ký tự đặc biệt bằng dấu gạch dưới
            link.download = `${(program.name || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_video.mp4`;
            
            // Thêm link vào DOM để có thể click
            document.body.appendChild(link);
            
            // Kích hoạt download bằng cách click vào link
            link.click();

            // Dọn dẹp: xóa link khỏi DOM
            document.body.removeChild(link);
            
            // Giải phóng bộ nhớ bằng cách xóa URL tạm thời
            window.URL.revokeObjectURL(url);

            // Hiển thị thông báo thành công
            message.success('Video đã được tải về thành công!');
        } catch (error) {
            // Nếu có lỗi, ghi log để debug
            console.error('Download failed:', error);
            message.error('Không thể tải video. Vui lòng thử lại sau.');

            // Phương án dự phòng: thử download trực tiếp bằng link
            try {
                const link = document.createElement('a');
                link.href = program.programVidUrl; // Dùng URL gốc
                link.download = `${program.name || 'video'}_video.mp4`;
                link.target = '_blank'; // Mở trong tab mới
                link.click();
            } catch (fallbackError) {
                // Nếu phương án dự phòng cũng thất bại
                console.error('Fallback download failed:', fallbackError);
            }
        } finally {
            // Luôn tắt loading state, dù thành công hay thất bại
            setDownloadLoading(false);
        }
    };

    const formatFileSize = () => {
        // This is a placeholder - in real app you'd get actual file size from API
        return "~ 50 MB";
    };

    return (
        <div style={{ padding: '32px' }}>
            <Title level={3} style={{
                color: '#2d3748',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 600
            }}>
                Tài liệu: {program.name}
            </Title>

            {program.programVidUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Video Download Card */}
                    <Card style={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        className="download-card"
                        hoverable
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                {/* Video Icon */}
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    backgroundColor: '#e6f7ff',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <PlayCircleOutlined style={{
                                        fontSize: '28px',
                                        color: '#20558A'
                                    }} />
                                </div>

                                {/* File Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        color: '#2d3748',
                                        fontSize: '16px',
                                        marginBottom: '4px'
                                    }}>
                                        Video chương trình
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#718096',
                                        marginBottom: '4px'
                                    }}>
                                        MP4 Video • {formatFileSize()}
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#a0aec0'
                                    }}>
                                        Tải trực tiếp về máy tính của bạn
                                    </div>
                                </div>
                            </div>

                            {/* Download Button */}
                            <Button
                                type="primary"
                                size="large"
                                icon={downloadLoading ? <LoadingOutlined /> : <DownloadOutlined />}
                                onClick={handleVideoDownload}
                                loading={downloadLoading}
                                style={{
                                    backgroundColor: '#20558A',
                                    borderColor: '#20558A',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    height: '44px',
                                    padding: '0 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {downloadLoading ? 'Đang tải...' : 'Tải về'}
                            </Button>
                        </div>
                    </Card>

                    {/* Additional Resources Placeholder */}
                    <Card style={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        opacity: 0.6
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '8px 0'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                backgroundColor: '#f7fafc',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileOutlined style={{
                                    fontSize: '28px',
                                    color: '#a0aec0'
                                }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#a0aec0',
                                    fontSize: '16px',
                                    marginBottom: '4px'
                                }}>
                                    Tài liệu PDF (Sắp có)
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#a0aec0'
                                }}>
                                    PDF Document • Sẽ cập nhật sớm
                                </div>
                            </div>

                            <Button
                                size="large"
                                disabled
                                style={{
                                    borderRadius: '8px',
                                    height: '44px',
                                    padding: '0 24px'
                                }}
                            >
                                Chưa có sẵn
                            </Button>
                        </div>
                    </Card>
                </div>
            ) : (
                <Card style={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    padding: '48px 24px',
                    backgroundColor: '#fafafa'
                }}>
                    <div style={{ color: '#a0aec0' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <DownloadOutlined style={{
                                fontSize: '36px',
                                color: '#d0d0d0'
                            }} />
                        </div>
                        <Title level={4} style={{
                            color: '#718096',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Chưa có tài liệu
                        </Title>
                        <p style={{
                            color: '#a0aec0',
                            margin: 0,
                            fontSize: '15px',
                            lineHeight: '1.5'
                        }}>
                            Tài liệu chương trình sẽ được cập nhật sớm.<br />
                            Vui lòng quay lại kiểm tra sau.
                        </p>
                    </div>
                </Card>
            )}

            <style>{`
                .download-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15) !important;
                    border-color: #20558A !important;
                }
            `}</style>
        </div>
    );
};

export default ProgramDownloadsTab; 