import React, { useEffect, useState } from "react";
import { Drawer, Descriptions, Tag, Button, Card, Statistic, Row, Col, Badge, Table, Avatar, Empty } from "antd";
import { EditOutlined, QuestionCircleOutlined, FileTextOutlined, BarChartOutlined, NumberOutlined, CheckCircleOutlined, StarOutlined } from "@ant-design/icons";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import type { SearchAnswerRequest } from "../../../../types/answer/Answer.req.type";
import { helpers } from "../../../../utils";

interface Props {
    open: boolean;
    questionData: QuestionResponse | null;
    surveys: SurveyResponse[];
    onClose: () => void;
    onEdit?: (question: QuestionResponse) => void;
}

const QuestionDetailDrawer: React.FC<Props> = ({ open, questionData, surveys, onClose, onEdit }) => {
    const [answers, setAnswers] = useState<AnswerResponse[]>([]);
    const [loadingAnswers, setLoadingAnswers] = useState(false);

    // Fetch answers when question data changes
    useEffect(() => {
        if (open && questionData) {
            fetchAnswers();
        }
    }, [open, questionData]);

    const fetchAnswers = async () => {
        if (!questionData) return;

        try {
            setLoadingAnswers(true);
            const searchParams: SearchAnswerRequest = {
                questionId: questionData.id,
                pageNumber: 1,
                pageSize: 1000, // Get all answers for this question
                filter: "",
                filterByScore: 0
            };

            const res = await AnswerService.getAllAnswers(searchParams);
            const responseData = res?.data;

            if (responseData && Array.isArray(responseData.data)) {
                setAnswers(responseData.data);
            } else {
                setAnswers([]);
            }
        } catch (error) {
            console.error("Error fetching answers:", error);
            helpers.notificationMessage("Không thể tải danh sách đáp án", "error");
            setAnswers([]);
        } finally {
            setLoadingAnswers(false);
        }
    };

    const getQuestionTypeDisplay = (type: QuestionType) => {
        switch (type) {
            case QuestionType.MULTIPLE_CHOICE:
                return "Trắc nghiệm";
            default:
                return type;
        }
    };

    const getQuestionTypeColor = (type: QuestionType) => {
        switch (type) {
            case QuestionType.MULTIPLE_CHOICE:
                return "blue";
            default:
                return "default";
        }
    };

    const getQuestionTypeIcon = (type: QuestionType) => {
        switch (type) {
            case QuestionType.MULTIPLE_CHOICE:
                return "📝";
            default:
                return "❓";
        }
    };

    const getSurveyName = (surveyId: string) => {
        const survey = surveys.find(s => s.id === surveyId);
        return survey?.name || surveyId;
    };

    const handleEdit = () => {
        if (questionData && onEdit) {
            onEdit(questionData);
            onClose();
        }
    };

    // Table columns for answers
    const answerColumns = [
        {
            title: <span className="font-semibold text-gray-700">Phương án</span>,
            dataIndex: "optionContent",
            key: "optionContent",
            render: (html: string, record: AnswerResponse) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                        }}
                    >
                        <CheckCircleOutlined />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 mb-1">
                            <span className="text-green-500 mr-2">#{record.positionOrder}</span>
                            <span className="truncate" dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Tag color="green" className="text-xs">
                                <StarOutlined className="mr-1" />
                                {record.score} điểm
                            </Tag>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Điểm</span>,
            dataIndex: "score",
            key: "score",
            width: 100,
            render: (score: number) => (
                <Tag color="green" className="px-3 py-1 rounded-full font-medium">
                    <StarOutlined className="mr-1" />
                    {score}
                </Tag>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Thứ tự</span>,
            dataIndex: "positionOrder",
            key: "positionOrder",
            width: 100,
            render: (order: number) => (
                <Badge count={order} showZero />
            ),
        },
    ];

    return (
        <Drawer
            title={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Chi tiết câu hỏi</h2>
                        <p className="text-sm text-gray-500">Xem thông tin chi tiết câu hỏi</p>
                    </div>
                </div>
            }
            placement="right"
            open={open}
            onClose={onClose}
            width={1200}
            destroyOnClose
            className="question-detail-drawer"
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
        // extra={
        //     <div className="flex gap-2">
        //         {questionData && onEdit && (
        //             <Button
        //                 type="primary"
        //                 icon={<EditOutlined />}
        //                 onClick={handleEdit}
        //                 size="large"
        //                 className="bg-blue-500 hover:bg-blue-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
        //             >
        //                 Chỉnh sửa
        //             </Button>
        //         )}
        //         <Button
        //             icon={<CloseOutlined />}
        //             onClick={onClose}
        //             size="large"
        //             className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
        //         >
        //             Đóng
        //         </Button>
        //     </div>
        // }
        >
            {questionData ? (
                <div className="space-y-8">

                    {/* Statistics Row */}
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Loại câu hỏi"
                                    value={getQuestionTypeDisplay(questionData.questionType)}
                                    valueStyle={{ color: '#3f87f5', fontSize: '16px' }}
                                    prefix={<QuestionCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Khảo sát"
                                    value={getSurveyName(questionData.surveyId || '')}
                                    valueStyle={{ color: '#10b981', fontSize: '16px' }}
                                    prefix={<BarChartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Thứ tự"
                                    value={questionData.positionOrder}
                                    valueStyle={{ color: '#f59e0b', fontSize: '16px' }}
                                    prefix={<NumberOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Số đáp án"
                                    value={answers.length}
                                    valueStyle={{ color: '#10b981', fontSize: '16px' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Question Details */}
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
                                        <BarChartOutlined className="mr-2" />
                                        Khảo sát
                                    </span>
                                }
                            >
                                <Tag color="blue" className="text-sm px-3 py-1 rounded-full">
                                    {getSurveyName(questionData.surveyId || '')}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <QuestionCircleOutlined className="mr-2" />
                                        Loại câu hỏi
                                    </span>
                                }
                            >
                                <Tag
                                    color={getQuestionTypeColor(questionData.questionType)}
                                    className="text-sm px-3 py-1 rounded-full"
                                >
                                    {getQuestionTypeIcon(questionData.questionType)} {getQuestionTypeDisplay(questionData.questionType)}
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
                                <Badge count={questionData.positionOrder} showZero />
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <FileTextOutlined className="mr-2" />
                                        Nội dung câu hỏi
                                    </span>
                                }
                            >
                                <div
                                    className="whitespace-pre-wrap text-base leading-relaxed p-8 bg-gray-50 rounded-lg prose prose-sm max-w-none border border-gray-100"
                                    dangerouslySetInnerHTML={{ __html: questionData.questionContent }}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Answers Section */}
                    <Card
                        title={
                            <span className="font-semibold text-gray-700">
                                <CheckCircleOutlined className="mr-2" />
                                Danh sách đáp án ({answers.length})
                            </span>
                        }
                        className="border-0 shadow-sm"
                    >
                        {loadingAnswers ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="text-gray-400 text-2xl mb-2">⏳</div>
                                    <p className="text-gray-500">Đang tải đáp án...</p>
                                </div>
                            </div>
                        ) : answers.length > 0 ? (
                            <Table
                                columns={answerColumns}
                                dataSource={answers}
                                rowKey="id"
                                pagination={false}
                                className="custom-table"
                                onRow={() => ({
                                    className: "hover:bg-green-50 transition-all duration-200 cursor-pointer"
                                })}
                            />
                        ) : (
                            <Empty
                                description="Chưa có đáp án nào cho câu hỏi này"
                                className="py-12"
                            />
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <Card className="border-0 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircleOutlined className="text-green-500 text-lg" />
                                <span className="text-sm text-gray-600">Câu hỏi đã sẵn sàng để sử dụng</span>
                            </div>
                            {questionData && onEdit && (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                    size="large"
                                    className="bg-primary hover:bg-primary/90 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    Chỉnh sửa câu hỏi
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">Không có dữ liệu câu hỏi</p>
                        <p className="text-gray-400 text-sm mt-2">Vui lòng chọn một câu hỏi để xem chi tiết</p>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default QuestionDetailDrawer;
