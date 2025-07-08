import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { helpers } from "../../../../utils";

import AnswerCreateModal from "./Create.com";
import AnswerUpdateModal from "./Update.com";
import AnswerDeleteButton from "./Delete.com";
import AnswerDetailDrawer from "./Detail.com";

interface Props {
    questions: QuestionResponse[];
    pageSizeDefault?: number;
}

const AnswerList: React.FC<Props> = ({ questions, pageSizeDefault = 10 }) => {
    const [questionId, setQuestionId] = useState<string | undefined>();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AnswerResponse[]>([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [editingAnswer, setEditingAnswer] = useState<AnswerResponse | null>(null);
    const [viewingAnswer, setViewingAnswer] = useState<AnswerResponse | null>(null);

    const fetchData = async () => {
        if (!questionId) return;
        try {
            setLoading(true);
            const res = await AnswerService.getAllAnswers({
                questionId,
                pageNumber,
                pageSize,
                filter: "",
                filterByScore: 0,
            } as any);
            const resp: any = res?.data ?? {};
            const list = resp.data ?? [];
            const totalCount = resp.totalCount ?? list.length;
            setData(list);
            setTotal(totalCount);
        } catch {
            helpers.notificationMessage("Không thể tải đáp án", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionId, pageNumber, pageSize]);

    const openCreate = () => {
        setCreateModalVisible(true);
    };

    const openEdit = (record: AnswerResponse) => {
        setEditingAnswer(record);
        setUpdateModalVisible(true);
    };

    const openDetail = (record: AnswerResponse) => {
        setViewingAnswer(record);
        setDetailDrawerVisible(true);
    };

    const handleDeleteSuccess = () => { fetchData(); };

    const handleCreateSuccess = () => { setCreateModalVisible(false); fetchData(); };
    const handleUpdateSuccess = () => { setUpdateModalVisible(false); setEditingAnswer(null); fetchData(); };

    const columns: ColumnsType<AnswerResponse> = [
        { title: "Phương án", dataIndex: "optionContent", key: "optionContent", render: (html) => <div dangerouslySetInnerHTML={{ __html: html }} /> },
        { title: "Điểm", dataIndex: "score", key: "score", width: 80 },
        { title: "Thứ tự", dataIndex: "positionOrder", key: "positionOrder", width: 80 },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => openDetail(record)} />
                    <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    <AnswerDeleteButton answer={record} onSuccess={handleDeleteSuccess} />
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* <div className="flex gap-4 mb-4 items-center flex-wrap">
                <Select
                    allowClear
                    placeholder="Chọn câu hỏi"
                    style={{ width: 300 }}
                    value={questionId}
                    onChange={(val) => {
                        setQuestionId(val);
                        setPageNumber(1);
                    }}
                >
                    {questions.map((q) => (
                        <Select.Option key={q.id} value={q.id}>
                            {q.questionContent}
                        </Select.Option>
                    ))}
                </Select>
            </div> */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pageNumber,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    onChange: (p, s) => {
                        setPageNumber(p);
                        setPageSize(s);
                    },
                }}
            />
            <Button onClick={openCreate}>Tạo đáp án</Button>

            <AnswerCreateModal
                open={createModalVisible}
                questions={questions}
                defaultQuestionId={questionId}
                onClose={() => setCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
            />

            <AnswerUpdateModal
                open={updateModalVisible}
                initialData={editingAnswer}
                questions={questions}
                onClose={() => { setUpdateModalVisible(false); setEditingAnswer(null); }}
                onSuccess={handleUpdateSuccess}
            />

            <AnswerDetailDrawer
                open={detailDrawerVisible}
                data={viewingAnswer}
                onClose={() => { setDetailDrawerVisible(false); setViewingAnswer(null); }}
            />
        </>
    );
};

export default AnswerList; 