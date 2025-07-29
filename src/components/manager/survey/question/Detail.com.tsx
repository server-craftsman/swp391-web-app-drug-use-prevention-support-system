import React from "react";
import { Drawer, Descriptions, Tag, Button, Card, Statistic, Row, Col, Badge } from "antd";
import { EditOutlined, QuestionCircleOutlined, FileTextOutlined, BarChartOutlined, NumberOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";

interface Props {
    open: boolean;
    questionData: QuestionResponse | null;
    surveys: SurveyResponse[];
    onClose: () => void;
    onEdit?: (question: QuestionResponse) => void;
}

const QuestionDetailDrawer: React.FC<Props> = ({ open, questionData, surveys, onClose, onEdit }) => {

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
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Loại câu hỏi"
                                    value={getQuestionTypeDisplay(questionData.questionType)}
                                    valueStyle={{ color: '#3f87f5', fontSize: '16px' }}
                                    prefix={<QuestionCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Khảo sát"
                                    value={getSurveyName(questionData.surveyId || '')}
                                    valueStyle={{ color: '#10b981', fontSize: '16px' }}
                                    prefix={<BarChartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200" style={{ minHeight: '120px' }}>
                                <Statistic
                                    title="Thứ tự"
                                    value={questionData.positionOrder}
                                    valueStyle={{ color: '#f59e0b', fontSize: '16px' }}
                                    prefix={<NumberOutlined />}
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
