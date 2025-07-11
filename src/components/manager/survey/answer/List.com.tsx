import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Card, Tag, Collapse, Empty } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { helpers } from "../../../../utils";

import AnswerCreateModal from "./Create.com";
import AnswerUpdateModal from "./Update.com";
import AnswerDeleteButton from "./Delete.com";
import AnswerDetailDrawer from "./Detail.com";

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

const AnswerList: React.FC<Props> = ({ questions, pageSizeDefault = 10 }) => {
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

    const answerColumns: ColumnsType<AnswerResponse> = [
        {
            title: "Phương án",
            dataIndex: "optionContent",
            key: "optionContent",
            render: (html) => <div dangerouslySetInnerHTML={{ __html: html }} />,
        },
        {
            title: "Điểm",
            dataIndex: "score",
            key: "score",
            width: 80,
            render: (score) => <Tag color="green">{score}</Tag>,
        },
        {
            title: "Thứ tự",
            dataIndex: "positionOrder",
            key: "positionOrder",
            width: 80,
            render: (order, record: AnswerResponse) => {
                // Check if there are duplicates in position order
                const currentQuestion = questionsWithAnswers.find(q => q.question.id === record.questionId);
                const answers = currentQuestion?.answers || [];
                const duplicateCount = answers.filter(a => a.positionOrder === order).length;
                const isDuplicate = duplicateCount > 1;

                return (
                    <Tag color={isDuplicate ? "red" : "blue"}>
                        #{order} {isDuplicate && "(Trùng)"}
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => openDetail(record)}
                    />
                    <AnswerDeleteButton answer={record} onSuccess={handleDeleteSuccess} />
                </Space>
            ),
        },
    ];

    return (
        <div className="answer-management">
            <div className="flex gap-4 mb-4 items-center">
                <Input.Search
                    placeholder="Tìm kiếm câu hỏi hoặc đáp án..."
                    style={{ width: 400 }}
                    allowClear
                    onSearch={(value) => setFilter(value)}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={loadAllAnswers}
                    title="Tải lại dữ liệu"
                >
                    Tải lại
                </Button>
                <div className="text-gray-500">
                    {questions.length} câu hỏi | {questionsWithAnswers.reduce((total, q) => total + q.answers.length, 0)} đáp án
                </div>
            </div>

            {filteredQuestionsWithAnswers.length === 0 ? (
                <Empty description="Không có câu hỏi nào" />
            ) : (
                <Collapse size="small">
                    {filteredQuestionsWithAnswers.map(({ question, answers, loading }) => (
                        <Panel
                            key={question.id || `question-${Math.random()}`}
                            header={
                                <div className="flex justify-between items-center w-full mr-4">
                                    <div>
                                        <strong dangerouslySetInnerHTML={{ __html: question.questionContent }}></strong>
                                        <Tag color="blue" className="ml-2">{question.questionType}</Tag>
                                        <Tag color="orange" className="ml-1">
                                            {answers.length} đáp án
                                        </Tag>
                                    </div>
                                </div>
                            }
                            extra={
                                <Space onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        type="primary"
                                        size="small"
                                        className="bg-primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => openCreate(question)}
                                    >
                                        Tạo đáp án
                                    </Button>
                                    {answers.length > 0 && (
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => openUpdate(question, answers)}
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
                                />
                            ) : (
                                <Table
                                    columns={answerColumns}
                                    dataSource={answers}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={false}
                                    size="small"
                                />
                            )}
                        </Panel>
                    ))}
                </Collapse>
            )}

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