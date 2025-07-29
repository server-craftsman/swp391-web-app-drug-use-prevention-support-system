import React, { useEffect, useState } from "react";
import { Drawer, Descriptions, Spin, Table, Tag, Card, Avatar, Statistic, Row, Col, Badge } from "antd";
import type { QuestionResponse } from "../../../types/question/Question.res.type";
import type { AnswerResponse } from "../../../types/answer/Answer.res.type";
import { QuestionService } from "../../../services/question/question.service";
import { AnswerService } from "../../../services/answer/answer.service";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { ClockCircleOutlined, FileTextOutlined, BarChartOutlined, QuestionCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface DetailProps {
    surveyId?: string | null;
    surveyName?: string;
    surveyType?: SurveyType;
    surveyDescription?: string;
    estimateTime?: number;
    open: boolean;
    onClose: () => void;
}

const SurveyDetailDrawer: React.FC<DetailProps> = ({ surveyId, surveyName, surveyType, surveyDescription, estimateTime, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<string, AnswerResponse[]>>({});

    useEffect(() => {
        if (open && surveyId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const qRes = await QuestionService.getQuestionBySurveyId(surveyId);
                    const qList = qRes?.data ?? [];
                    setQuestions(qList);
                    // Fetch answers for each question in parallel
                    const answerPromises = qList.map((q) => AnswerService.getAnswerByQuestionId(q.id));
                    const answerResList = await Promise.all(answerPromises);
                    const map: Record<string, AnswerResponse[]> = {};
                    answerResList.forEach((res, idx) => {
                        map[qList[idx].id] = res?.data ?? [];
                    });
                    setAnswersMap(map);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, surveyId]);

    const getSurveyTypeIcon = (type: SurveyType) => {
        const iconMap = {
            [SurveyType.RISK_ASSESSMENT]: "⚠️",
            [SurveyType.PRE_FEEDBACK]: "🚀",
            [SurveyType.POST_FEEDBACK]: "✅",
        };
        return iconMap[type] || "📊";
    };

    const getSurveyTypeColor = (type: SurveyType) => {
        const colorMap = {
            [SurveyType.RISK_ASSESSMENT]: "orange",
            [SurveyType.PRE_FEEDBACK]: "green",
            [SurveyType.POST_FEEDBACK]: "purple",
        };
        return colorMap[type] || "default";
    };

    const getSurveyTypeDisplayName = (type: SurveyType) => {
        const nameMap = {
            [SurveyType.RISK_ASSESSMENT]: "Đánh giá Rủi ro",
            [SurveyType.PRE_FEEDBACK]: "Phản hồi Trước",
            [SurveyType.POST_FEEDBACK]: "Phản hồi Sau",
        };
        return nameMap[type] || type;
    };

    const answerColumns = [
        {
            title: <span className="font-semibold text-gray-700">Phương án</span>,
            dataIndex: "optionContent",
            key: "optionContent",
            render: (content: string) => (
                <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-gray-700">{content}</span>
                </div>
            )
        },
        {
            title: <span className="font-semibold text-gray-700">Điểm</span>,
            dataIndex: "score",
            key: "score",
            width: 80,
            render: (score: number) => (
                <Tag color="blue" className="font-medium">
                    {score} điểm
                </Tag>
            )
        },
        {
            title: <span className="font-semibold text-gray-700">Thứ tự</span>,
            dataIndex: "positionOrder",
            key: "positionOrder",
            width: 80,
            render: (order: number) => (
                <Badge count={order} showZero />
            )
        },
    ];

    return (
        <Drawer
            title={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Chi tiết khảo sát</h2>
                        <p className="text-sm text-gray-500">{surveyName || ""}</p>
                    </div>
                </div>
            }
            width={1200}
            open={open}
            onClose={onClose}
            destroyOnClose
            className="survey-detail-drawer"
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
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Survey Overview Card */}
                    <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={64}
                                    style={{
                                        backgroundColor: getSurveyTypeColor(surveyType || SurveyType.RISK_ASSESSMENT),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}
                                >
                                    {getSurveyTypeIcon(surveyType || SurveyType.RISK_ASSESSMENT)}
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{surveyName}</h3>
                                    <Tag
                                        color={getSurveyTypeColor(surveyType || SurveyType.RISK_ASSESSMENT)}
                                        className="px-3 py-1 rounded-full font-medium border-0"
                                        style={{ margin: 0 }}
                                    >
                                        {getSurveyTypeDisplayName(surveyType || SurveyType.RISK_ASSESSMENT)}
                                    </Tag>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
                                <div className="text-sm text-gray-500">câu hỏi</div>
                            </div>
                        </div>
                    </Card>

                    {/* Statistics Row */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Tổng câu hỏi"
                                    value={questions.length}
                                    valueStyle={{ color: '#3f87f5' }}
                                    prefix={<QuestionCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Tổng phương án"
                                    value={Object.values(answersMap).reduce((sum, answers) => sum + answers.length, 0)}
                                    valueStyle={{ color: '#10b981' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                <Statistic
                                    title="Thời gian ước tính"
                                    value={estimateTime || 5}
                                    suffix="phút"
                                    valueStyle={{ color: '#f59e0b' }}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Survey Details */}
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
                                        <FileTextOutlined className="mr-2" />
                                        Tên khảo sát
                                    </span>
                                }
                            >
                                {surveyName}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <BarChartOutlined className="mr-2" />
                                        Loại khảo sát
                                    </span>
                                }
                            >
                                <Tag
                                    color={getSurveyTypeColor(surveyType || SurveyType.RISK_ASSESSMENT)}
                                    className="px-3 py-1 rounded-full font-medium border-0"
                                >
                                    {getSurveyTypeDisplayName(surveyType || SurveyType.RISK_ASSESSMENT)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <ClockCircleOutlined className="mr-2" />
                                        Thời gian ước tính
                                    </span>
                                }
                            >
                                {estimateTime ? `${estimateTime} phút` : 'Không xác định'}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <FileTextOutlined className="mr-2" />
                                        Mô tả
                                    </span>
                                }
                            >
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: surveyDescription || '' }}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Questions Section */}
                    {questions.length > 0 && (
                        <Card
                            title={
                                <span className="font-semibold text-gray-700">
                                    <QuestionCircleOutlined className="mr-2" />
                                    Danh sách câu hỏi ({questions.length})
                                </span>
                            }
                            className="border-0 shadow-sm"
                        >
                            <div className="space-y-6">
                                {questions.map((q, index) => (
                                    <div key={q.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-all duration-200">
                                        <div className="flex items-start gap-3 mb-4">
                                            <Badge count={index + 1} showZero />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-2">Câu hỏi {index + 1}</h4>
                                                <div
                                                    className="prose prose-sm max-w-none mb-3"
                                                    dangerouslySetInnerHTML={{ __html: q.questionContent }}
                                                />
                                                {(q as any).description && (
                                                    <p className="text-sm text-gray-600 italic">
                                                        {(q as any).description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {answersMap[q.id] && answersMap[q.id].length > 0 && (
                                            <div className="ml-8">
                                                <h5 className="font-medium text-gray-700 mb-3">Các phương án trả lời:</h5>
                                                <Table
                                                    dataSource={answersMap[q.id]}
                                                    columns={answerColumns}
                                                    pagination={false}
                                                    rowKey="id"
                                                    size="small"
                                                    className="custom-table"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {questions.length === 0 && (
                        <Card className="border-0 shadow-sm text-center py-12">
                            <div className="text-gray-500">
                                <QuestionCircleOutlined className="text-4xl mb-4" />
                                <p className="text-lg font-medium">Chưa có câu hỏi nào</p>
                                <p className="text-sm">Khảo sát này chưa có câu hỏi nào được thêm vào.</p>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </Drawer>
    );
};

export default SurveyDetailDrawer; 