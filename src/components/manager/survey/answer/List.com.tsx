import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Tag, Empty, Card, Avatar, Statistic, Row, Col, Tooltip, Badge, Pagination } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, StarOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import type { SearchAnswerRequest } from "../../../../types/answer/Answer.req.type";
import { helpers } from "../../../../utils";
import AnswerCreateModal from "./Create.com";
import AnswerUpdateModal from "./Update.com";
import AnswerDeleteButton from "./Delete.com";
import AnswerDetailDrawer from "./Detail.com";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { QuestionService } from "../../../../services/question/question.service";


interface Props {
    questions: QuestionResponse[];
    pageSizeDefault?: number;
}

const AnswerList: React.FC<Props> = ({ questions, pageSizeDefault = 10 }) => {
    console.log("AnswerList rendered with questions:", questions); // Debug log
    console.log("Questions length:", questions?.length); // Debug log

    const [filter, setFilter] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AnswerResponse[]>([]);
    const [localQuestions, setLocalQuestions] = useState<QuestionResponse[]>([]);

    // Modal states
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerResponse[]>([]);
    const [viewingAnswer, setViewingAnswer] = useState<AnswerResponse | null>(null);

    // Monitor questions prop changes
    useEffect(() => {
        console.log("Questions prop changed:", questions);
        console.log("Questions length:", questions?.length);

        // If questions are empty, try to load them
        if (!questions || questions.length === 0) {
            console.log("Questions array is empty, will load questions directly");
            loadQuestions();
        }
    }, [questions]);

    const loadQuestions = async () => {
        try {
            console.log("Loading questions directly in AnswerList");
            const res = await QuestionService.getAllQuestions({
                surveyId: "",
                pageNumber: 1,
                pageSize: 1000,
                filter: "",
            });

            const responseData = res?.data;
            if (responseData && Array.isArray(responseData.data)) {
                console.log("Loaded questions in AnswerList:", responseData.data);
                setLocalQuestions(responseData.data);
            }
        } catch (error) {
            console.error("Error loading questions in AnswerList:", error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            // Use getAllAnswers without questionId filter
            const searchParams: SearchAnswerRequest = {
                questionId: "", // Empty string to get all answers
                pageNumber: pageNumber,
                pageSize: pageSize,
                filter: filter,
                filterByScore: 0 // 0 means no filter by score
            };

            const res = await AnswerService.getAllAnswers(searchParams);
            const responseData = res?.data;

            if (responseData && Array.isArray(responseData.data)) {
                setData(responseData.data);
                setTotal(responseData.totalCount || 0);
            } else {
                console.warn("Unexpected response format:", responseData);
                setData([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Error fetching answers:", error);
            helpers.notificationMessage("Không thể tải đáp án", "error");
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber, pageSize, filter]);

    // Reset to first page when filter changes
    useEffect(() => {
        setPageNumber(1);
    }, [filter]);

    const handlePageChange = (page: number, size?: number) => {
        setPageNumber(page);
        if (size && size !== pageSize) {
            setPageSize(size);
        }
    };

    const openDetail = (answer: AnswerResponse) => {
        setViewingAnswer(answer);
        setDetailDrawerVisible(true);
    };

    const handleDeleteSuccess = () => {
        fetchData();
    };

    const handleCreateSuccess = () => {
        setCreateModalVisible(false);
        setSelectedQuestion(null);
        fetchData();
    };

    const handleUpdateSuccess = () => {
        setUpdateModalVisible(false);
        setSelectedQuestion(null);
        setSelectedAnswers([]);
        fetchData();
    };

    const getQuestionType = (questionId: string) => {
        // Use prop questions first, fallback to local questions    
        const availableQuestions = questions && questions.length > 0 ? questions : localQuestions;
        const question = availableQuestions.find(q => q.id === questionId);
        return question?.questionType || QuestionType.MULTIPLE_CHOICE;
    };  

    const getDisplayQuestionType = (questionType: QuestionType) => {
        switch (questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                return "Trắc nghiệm";
            default:
                return "Câu hỏi khác";
        }
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
                            <Tag color="blue" className="text-xs">
                                {getDisplayQuestionType(getQuestionType(record.questionId))}
                            </Tag>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Câu hỏi</span>,
            dataIndex: "questionContent",
            key: "questionContent",
            render: (questionContent: string) => (
                <div className="max-w-xs">
                    <div className="font-medium text-gray-800 truncate" dangerouslySetInnerHTML={{ __html: questionContent }} />
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
            render: (order) => (
                <Badge count={order} showZero />
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            key: "action",
            width: 150,
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
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                const question = questions.find(q => q.id === record.questionId);
                                if (question) {
                                    setSelectedQuestion(question);
                                    setSelectedAnswers([record]);
                                    setUpdateModalVisible(true);
                                }
                            }}
                            className="hover:bg-green-50 hover:text-green-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <AnswerDeleteButton answer={record} onSuccess={handleDeleteSuccess} />
                </Space>
            ),
        },
    ];

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
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                        <Statistic
                            title="Tổng đáp án"
                            value={total}
                            valueStyle={{ color: '#10b981' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                        <Statistic
                            title="Đang hiển thị"
                            value={`${data.length}/${total}`}
                            valueStyle={{ color: '#f59e0b' }}
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
                            placeholder="Tìm kiếm đáp án..."
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

            {/* Table Section */}
            <Card className="border-0 shadow-sm">
                {data.length === 0 ? (
                    <Empty
                        description="Không có đáp án nào"
                        className="py-12"
                    />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Danh sách đáp án</h3>
                            <div className="flex gap-2">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setCreateModalVisible(true)}
                                    className="bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                    size="large"
                                >
                                    Tạo đáp án mới
                                </Button>
                            </div>
                        </div>

                        <Table
                            columns={answerColumns}
                            dataSource={data}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                            className="custom-table"
                            onRow={() => ({
                                className: "hover:bg-green-50 transition-all duration-200 cursor-pointer"
                            })}
                        />

                        {/* Pagination */}
                        {total > pageSize && (
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    current={pageNumber}
                                    total={total}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} của ${total} đáp án`
                                    }
                                    pageSizeOptions={['5', '10', '20', '50']}
                                    className="custom-pagination"
                                />
                            </div>
                        )}
                    </>
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