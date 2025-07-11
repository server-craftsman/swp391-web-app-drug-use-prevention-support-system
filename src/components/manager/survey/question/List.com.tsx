import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
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

    const getSurveyName = (surveyId: string) => {
        const survey = surveys.find(s => s.id === surveyId);
        const name = survey?.name || surveyId;
        return name.length > 20 ? name.substring(0, 20) + '...' : name;
    };

    const columns: ColumnsType<QuestionResponse> = [
        {
            title: "Khảo sát",
            dataIndex: "surveyId",
            key: "surveyId",
            width: 200,
            render: (surveyId: string) => {
                const survey = surveys.find(s => s.id === surveyId);
                const fullName = survey?.name || surveyId;
                const displayName = getSurveyName(surveyId);
                return (
                    <Tag color="blue" title={fullName}>{displayName}</Tag>
                );
            }
        },
        {
            title: "Câu hỏi",
            dataIndex: "questionContent",
            key: "questionContent",
            ellipsis: true,
            render: (text: string) => (
                <div className="max-w-md truncate" title={text} dangerouslySetInnerHTML={{ __html: text }} />
            )
        },
        {
            title: "Loại",
            dataIndex: "questionType",
            key: "questionType",
            width: 120,
            render: (type: QuestionType) => getQuestionTypeDisplay(type)
        },
        {
            title: "Thứ tự",
            dataIndex: "positionOrder",
            key: "positionOrder",
            width: 80,
            align: "center",
            render: (text: string) => (
                <span className="text-blue-500 font-bold">#{text}</span>
            )
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetail(record);
                        }}
                        title="Xem chi tiết"
                    />
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(record);
                        }}
                        title="Chỉnh sửa"
                    />
                    <QuestionDeleteButton
                        question={record}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="flex gap-4 mb-4 items-center flex-wrap">
                <Input
                    placeholder="Tìm kiếm câu hỏi..."
                    style={{ width: 300 }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Button className="bg-primary" type="primary" onClick={handleSearchClick}>
                    Lọc
                </Button>
                <Button
                    className="bg-primary"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreate}
                >
                    Tạo câu hỏi
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => onSelectQuestion?.(record),
                    style: { cursor: 'pointer' }
                })}
                pagination={{
                    current: pageNumber,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} câu hỏi`,
                    onChange: (p, s) => {
                        setPageNumber(p);
                        setPageSize(s || pageSizeDefault);
                    },
                }}
                size="small"
            />

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
        </>
    );
};

export default QuestionList; 