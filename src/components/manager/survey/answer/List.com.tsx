import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Tag, Collapse, Empty, Card, Avatar, Statistic, Row, Col, Tooltip, Badge } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, QuestionCircleOutlined, StarOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { helpers } from "../../../../utils";
import AnswerCreateModal from "./Create.com";
import AnswerUpdateModal from "./Update.com";
import AnswerDeleteButton from "./Delete.com";
import AnswerDetailDrawer from "./Detail.com";
import { QuestionType } from "../../../../app/enums/questionType.enum";

const { Panel } = Collapse;

interface Props {
    questions: QuestionResponse[];
    pageSizeDefault?: number;
}

interface QuestionWithAnswers {
    question: QuestionResponse;
    answers: AnswerResponse[];
    loading: boolean;
}

const AnswerList: React.FC<Props> = ({ questions }) => {
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswers[]>([]);
    const [filter, setFilter] = useState("");
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerResponse[]>([]);
    const [viewingAnswer, setViewingAnswer] = useState<AnswerResponse | null>(null);

    const fetchAnswersForQuestion = async (question: QuestionResponse) => {
        try {
            const res = await AnswerService.getAnswerByQuestionId(question.id);
            // ResponseSuccess<AnswerResponse[]> structure: { success: boolean, data: AnswerResponse[] }
            const answers = res?.data || [];
            // Sort answers by positionOrder
            const sortedAnswers = Array.isArray(answers)
                ? answers.sort((a, b) => a.positionOrder - b.positionOrder)
                : [];
            return sortedAnswers;
        } catch (error) {
            console.error(`Error fetching answers for question ${question.id}:`, error);
            helpers.notificationMessage(`Không thể tải đáp án cho câu hỏi: ${question.questionContent}`, "error");
            return [];
        }
    };

    const loadAllAnswers = async () => {
        console.log("Loading answers for questions:", questions.length);
        const questionAnswerPromises = questions.map(async (question) => {
            console.log(`Fetching answers for question: ${question.questionContent} (${question.id})`);
            const answers = await fetchAnswersForQuestion(question);
            console.log(`Found ${answers.length} answers for question: ${question.questionContent}`);
            return {
                question,
                answers,
                loading: false,
            };
        });

        const results = await Promise.all(questionAnswerPromises);
        console.log("All answers loaded:", results);
        setQuestionsWithAnswers(results);
    };

    useEffect(() => {
        if (questions.length > 0) {
            loadAllAnswers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions]);

    const filteredQuestionsWithAnswers = questionsWithAnswers.filter(
        ({ question, answers }) =>
            filter === "" ||
            question.questionContent.toLowerCase().includes(filter.toLowerCase()) ||
            answers.some(answer => answer.optionContent.toLowerCase().includes(filter.toLowerCase()))
    );

    const openCreate = (question: QuestionResponse) => {
        setSelectedQuestion(question);
        setCreateModalVisible(true);
    };

    const openUpdate = (question: QuestionResponse, answers: AnswerResponse[]) => {
        setSelectedQuestion(question);
        setSelectedAnswers(answers);
        setUpdateModalVisible(true);
    };

    const openDetail = (answer: AnswerResponse) => {
        setViewingAnswer(answer);
        setDetailDrawerVisible(true);
    };

    const handleDeleteSuccess = () => {
        loadAllAnswers();
    };

    const handleCreateSuccess = () => {
        setCreateModalVisible(false);
        setSelectedQuestion(null);
        loadAllAnswers();
    };

    const handleUpdateSuccess = () => {
        setUpdateModalVisible(false);
        setSelectedQuestion(null);
        setSelectedAnswers([]);
        loadAllAnswers();
    };

    const getTotalAnswers = () => {
        return questionsWithAnswers.reduce((total, q) => total + q.answers.length, 0);
    };

    const answerColumns: ColumnsType<AnswerResponse> = [
        {
            title: <span className="font-semibold text-gray-700">Phương án</span>,
            dataIndex: "optionContent",
            key: "optionContent",
            render: (html, record: AnswerResponse) => (
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
            render: (score) => (
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
            render: (order, record: AnswerResponse) => {
                // Check if there are duplicates in position order
                const currentQuestion = questionsWithAnswers.find(q => q.question.id === record.questionId);
                const answers = currentQuestion?.answers || [];
                const duplicateCount = answers.filter(a => a.positionOrder === order).length;
                const isDuplicate = duplicateCount > 1;

                return (
                    <Badge
                        count={order}
                        showZero
                        title={isDuplicate ? "Thứ tự trùng lặp" : ""}
                    />
                );
            },
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => openDetail(record)}
                            className="hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <AnswerDeleteButton answer={record} onSuccess={handleDeleteSuccess} />
                </Space>
            ),
        },
    ];

    const getDisplayQuestionType = (questionType: QuestionType) => {
        switch (questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                return "Trắc nghiệm";
            default:
                return "Câu hỏi khác";
        }
    };
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <CheckCircleOutlined className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Đáp án</h2>
                            <p className="text-gray-600">Tạo và quản lý các phương án trả lời</p>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-4">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={loadAllAnswers}
                            size="large"
                            className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
                        >
                            Tải lại
                        </Button>
                    </div> */}
                </div>
            </div>

            {/* Statistics Cards */}
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
                            title="Tổng đáp án"
                            value={getTotalAnswers()}
                            valueStyle={{ color: '#10b981' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Filter Section */}
            <Card className="border-0 shadow-sm">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Tìm kiếm câu hỏi hoặc đáp án..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="h-12 rounded-xl border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                            size="large"
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={() => setFilter("")}
                        size="large"
                        className="bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-12 px-6 rounded-xl"
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            </Card>

            {/* Questions and Answers Section */}
            <Card className="border-0 shadow-sm">
                {filteredQuestionsWithAnswers.length === 0 ? (
                    <Empty
                        description="Không có câu hỏi nào"
                        className="py-12"
                    />
                ) : (
                    <Collapse size="large" className="border-0">
                        {filteredQuestionsWithAnswers.map(({ question, answers, loading }) => (
                            <Panel
                                key={question.id || `question-${Math.random()}`}
                                header={
                                    <div className="flex justify-between items-center w-full mr-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                size={32}
                                                style={{
                                                    backgroundColor: '#3f87f5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <QuestionCircleOutlined />
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-gray-800" dangerouslySetInnerHTML={{ __html: question.questionContent }}></div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Tag color="blue" className="text-xs">
                                                        {getDisplayQuestionType(question.questionType)}
                                                    </Tag>
                                                    <Tag color="orange" className="text-xs">
                                                        {answers.length} đáp án
                                                    </Tag>
                                                    <Tag color="purple" className="text-xs">
                                                        #{question.positionOrder}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                extra={
                                    <Space onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                            icon={<PlusOutlined />}
                                            onClick={() => openCreate(question)}
                                        >
                                            Tạo đáp án
                                        </Button>
                                        {answers.length > 0 && (
                                            <Button
                                                size="large"
                                                icon={<EditOutlined />}
                                                onClick={() => openUpdate(question, answers)}
                                                className="border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
                                            >
                                                Sửa tất cả
                                            </Button>
                                        )}
                                    </Space>
                                }
                            >
                                {answers.length === 0 ? (
                                    <Empty
                                        description="Chưa có đáp án nào"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        className="py-8"
                                    />
                                ) : (
                                    <Table
                                        columns={answerColumns}
                                        dataSource={answers}
                                        rowKey="id"
                                        loading={loading}
                                        pagination={false}
                                        className="custom-table"
                                        onRow={() => ({
                                            className: "hover:bg-green-50 transition-all duration-200 cursor-pointer"
                                        })}
                                    />
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                )}
            </Card>

            <AnswerCreateModal
                open={createModalVisible}
                question={selectedQuestion}
                onClose={() => {
                    setCreateModalVisible(false);
                    setSelectedQuestion(null);
                }}
                onSuccess={handleCreateSuccess}
            />

            <AnswerUpdateModal
                open={updateModalVisible}
                question={selectedQuestion}
                existingAnswers={selectedAnswers}
                onClose={() => {
                    setUpdateModalVisible(false);
                    setSelectedQuestion(null);
                    setSelectedAnswers([]);
                }}
                onSuccess={handleUpdateSuccess}
            />

            <AnswerDetailDrawer
                open={detailDrawerVisible}
                data={viewingAnswer}
                onClose={() => {
                    setDetailDrawerVisible(false);
                    setViewingAnswer(null);
                }}
            />
        </div>
    );
};

export default AnswerList;