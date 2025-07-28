import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag, Card, Statistic, Row, Col, Tooltip, Badge } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined, FilterOutlined, QuestionCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { QuestionService } from "../../../../services/question/question.service";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { helpers } from "../../../../utils";

// Import the components
import QuestionCreateModal from "./Create.com";
import QuestionUpdateModal from "./Update.com";
import QuestionDeleteButton from "./Delete.com";
import QuestionDetailDrawer from "./Detail.com";

interface Props {
    surveys: SurveyResponse[];
    onLoadedQuestions?: (questions: QuestionResponse[]) => void;
    onSelectQuestion?: (question: QuestionResponse) => void;
    pageSizeDefault?: number;
}

const QuestionList: React.FC<Props> = ({ surveys, onLoadedQuestions, onSelectQuestion, pageSizeDefault = 10 }) => {
    const [filter, setFilter] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuestionResponse[]>([]);

    /* Modal states */
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
    const [viewingQuestion, setViewingQuestion] = useState<QuestionResponse | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch questions for all surveys
            const allQuestions: QuestionResponse[] = [];

            for (const survey of surveys) {
                try {
                    const res = await QuestionService.getQuestionBySurveyId(survey.id);
                    const questions = (res as any)?.data || [];
                    allQuestions.push(...questions);
                } catch (error) {
                    console.error(`Error fetching questions for survey ${survey.id}:`, error);
                }
            }

            // Apply filter if needed
            const filteredQuestions = filter
                ? allQuestions.filter(q =>
                    q.questionContent.toLowerCase().includes(filter.toLowerCase()) ||
                    q.questionType.toLowerCase().includes(filter.toLowerCase())
                )
                : allQuestions;

            // Sort by survey name and position order
            filteredQuestions.sort((a, b) => {
                const surveyA = surveys.find(s => s.id === a.surveyId)?.name || '';
                const surveyB = surveys.find(s => s.id === b.surveyId)?.name || '';

                if (surveyA !== surveyB) {
                    return surveyA.localeCompare(surveyB);
                }
                return a.positionOrder - b.positionOrder;
            });

            // Apply pagination
            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = filteredQuestions.slice(startIndex, endIndex);

            setData(paginatedData);
            setTotal(filteredQuestions.length);
            onLoadedQuestions?.(paginatedData);
        } catch {
            helpers.notificationMessage("Không thể tải câu hỏi", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (surveys.length > 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, pageSize, surveys]);

    /* Handle manual search click */
    const handleSearchClick = () => {
        if (pageNumber !== 1) {
            setPageNumber(1); // useEffect will fetch
        } else {
            fetchData();
        }
    };

    const openCreate = () => {
        setCreateModalVisible(true);
    };

    const openEdit = (record: QuestionResponse) => {
        console.log("Opening edit modal for question:", record);
        console.log("Available surveys:", surveys);
        setEditingQuestion(record);
        setUpdateModalVisible(true);
    };

    const openDetail = (record: QuestionResponse) => {
        setViewingQuestion(record);
        setDetailDrawerVisible(true);
    };

    const handleCreateSuccess = () => {
        setCreateModalVisible(false);
        fetchData();
    };

    const handleUpdateSuccess = () => {
        setUpdateModalVisible(false);
        setEditingQuestion(null);
        fetchData();
    };

    const handleDeleteSuccess = () => {
        fetchData();
    };

    const getQuestionTypeDisplay = (type: QuestionType) => {
        switch (type) {
            case QuestionType.MULTIPLE_CHOICE:
                return "Trắc nghiệm";
            default:
                return type;
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
        const name = survey?.name || surveyId;
        return name.length > 40 ? name.substring(0, 40) + '...' : name;
    };

    const columns: ColumnsType<QuestionResponse> = [
        {
            title: <span className="font-semibold text-gray-700">Câu hỏi</span>,
            dataIndex: "questionContent",
            key: "questionContent",
            render: (text: string, record: QuestionResponse) => (
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 mb-1">
                            <span className="text-blue-500 mr-2">#{record.positionOrder}</span>
                            <span className="truncate" dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Tag color="green" className="mr-1">
                                <BarChartOutlined className="mr-1" />
                                Khảo sát: {getSurveyName(record.surveyId || '')}
                            </Tag>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Loại</span>,
            dataIndex: "questionType",
            key: "questionType",
            width: 120,
            render: (type: QuestionType) => (
                <Tag
                    color="blue"
                    className="px-3 py-1 rounded-full font-medium border-0"
                    style={{ margin: 0 }}
                >
                    {getQuestionTypeIcon(type)} {getQuestionTypeDisplay(type)}
                </Tag>
            )
        },
        {
            title: <span className="font-semibold text-gray-700">Thứ tự</span>,
            dataIndex: "positionOrder",
            key: "positionOrder",
            width: 80,
            align: "center",
            render: (text: number) => (
                <Badge count={text} showZero/>
            )
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openDetail(record);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit(record);
                            }}
                            className="hover:bg-green-50 hover:text-green-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <QuestionDeleteButton
                        question={record}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <QuestionCircleOutlined className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Câu hỏi</h2>
                            <p className="text-gray-600">Tạo và quản lý các câu hỏi trong khảo sát</p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreate}
                        size="large"
                        className="bg-primary hover:bg-primary/90 border-0 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 rounded-xl"
                    >
                        Tạo câu hỏi mới
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                        <Statistic
                            title="Tổng câu hỏi"
                            value={total}
                            valueStyle={{ color: '#3f87f5' }}
                            prefix={<QuestionCircleOutlined />}
                        />

                    </Card>    
                </Col>
            </Row>
            {/* Search and Filter Section */}
            <Card className="border-0 shadow-sm">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Tìm kiếm câu hỏi..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200"
                            size="large"
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={handleSearchClick}
                        size="large"
                        className="bg-primary hover:bg-primary/90 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-12 px-6 rounded-xl"
                    >
                        Lọc
                    </Button>
                </div>
            </Card>

            {/* Table Section */}
            <Card className="border-0 shadow-sm">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => onSelectQuestion?.(record),
                        className: "hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    })}
                    pagination={{
                        current: pageNumber,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <span className="text-sm text-gray-600">
                                Hiển thị <span className="font-semibold">{range[0]}-{range[1]}</span> trong tổng số <span className="font-semibold">{total}</span> câu hỏi
                            </span>
                        ),
                        onChange: (p, s) => {
                            setPageNumber(p);
                            setPageSize(s || pageSizeDefault);
                        },
                        className: "mt-6",
                    }}
                    className="custom-table"
                />
            </Card>

            {/* Modals */}
            <QuestionCreateModal
                open={createModalVisible}
                surveys={surveys}
                onClose={() => setCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
            />

            <QuestionUpdateModal
                open={updateModalVisible}
                initialData={editingQuestion}
                surveys={surveys}
                onClose={() => {
                    setUpdateModalVisible(false);
                    setEditingQuestion(null);
                }}
                onSuccess={handleUpdateSuccess}
            />

            {/* Detail Drawer */}
            <QuestionDetailDrawer
                open={detailDrawerVisible}
                questionData={viewingQuestion}
                surveys={surveys}
                onClose={() => {
                    setDetailDrawerVisible(false);
                    setViewingQuestion(null);
                }}
                onEdit={(question) => {
                    setDetailDrawerVisible(false);
                    openEdit(question);
                }}
            />
        </div>
    );
};

export default QuestionList; 