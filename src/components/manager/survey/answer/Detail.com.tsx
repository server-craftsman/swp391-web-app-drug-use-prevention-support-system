import React from "react";
import { Drawer, Descriptions, Tag, Card, Avatar, Statistic, Row, Col, Badge } from "antd";
import { CheckCircleOutlined, FileTextOutlined, StarOutlined, NumberOutlined } from "@ant-design/icons";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";

interface Props {
    open: boolean;
    data: AnswerResponse | null;
    onClose: () => void;
}

const AnswerDetailDrawer: React.FC<Props> = ({ open, data, onClose }) => {
    return (
        <Drawer
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircleOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Chi tiết đáp án</h2>
                        <p className="text-sm text-gray-500">Xem thông tin chi tiết đáp án</p>
                    </div>
                </div>
            }
            placement="right"
            width={1200}
            open={open}
            onClose={onClose}
            destroyOnClose
            className="answer-detail-drawer"
            styles={{
                body: {
                    padding: '24px 32px'
                },
                content: {
                    background: 'white'
                },
                header: {
                    background: 'white',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '24px 32px 0'
                }
            }}
        >
            {data ? (
                <div className="space-y-6">
                    {/* Answer Overview Card */}
                    <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={64}
                                    style={{
                                        backgroundColor: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}
                                >
                                    <CheckCircleOutlined />
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Đáp án #{data.positionOrder}</h3>
                                    <Tag
                                        color="green"
                                        className="px-3 py-1 rounded-full font-medium border-0"
                                        style={{ margin: 0 }}
                                    >
                                        <CheckCircleOutlined /> Phương án trả lời
                                    </Tag>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-green-600">{data.score}</div>
                                <div className="text-sm text-gray-500">điểm</div>
                            </div>
                        </div>
                    </Card>

                    {/* Statistics Row */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Điểm số"
                                    value={data.score}
                                    valueStyle={{ color: '#10b981' }}
                                    prefix={<StarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Thứ tự"
                                    value={data.positionOrder}
                                    valueStyle={{ color: '#3f87f5' }}
                                    prefix={<NumberOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Trạng thái"
                                    value="Hoạt động"
                                    valueStyle={{ color: '#f59e0b', fontSize: '16px' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Answer Details */}
                    <Card
                        title={
                            <span className="font-semibold text-gray-700">
                                <FileTextOutlined className="mr-2" />
                                Thông tin chi tiết
                            </span>
                        }
                        className="border-0 shadow-sm"
                    >
                        <Descriptions column={1} size="small" className="mt-4">
                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <StarOutlined className="mr-2" />
                                        Điểm số
                                    </span>
                                }
                            >
                                <Tag color="green" className="text-sm px-3 py-1 rounded-full font-medium">
                                    {data.score} điểm
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <NumberOutlined className="mr-2" />
                                        Thứ tự
                                    </span>
                                }
                            >
                                <Badge count={data.positionOrder} showZero />
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <FileTextOutlined className="mr-2" />
                                        Nội dung đáp án
                                    </span>
                                }
                            >
                                <div
                                    className="whitespace-pre-wrap text-base leading-relaxed p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none border border-gray-100"
                                    dangerouslySetInnerHTML={{ __html: data.optionContent }}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Action Buttons */}
                    <Card className="border-0 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircleOutlined className="text-green-500 text-lg" />
                                <span className="text-sm text-gray-600">Đáp án đã sẵn sàng để sử dụng</span>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">Không có dữ liệu đáp án</p>
                        <p className="text-gray-400 text-sm mt-2">Vui lòng chọn một đáp án để xem chi tiết</p>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default AnswerDetailDrawer;
