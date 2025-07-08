import React, { useEffect, useState } from "react";
import { Drawer, Descriptions, Spin, Table, Tag } from "antd";
import type { QuestionResponse } from "../../../types/question/Question.res.type";
import type { AnswerResponse } from "../../../types/answer/Answer.res.type";
import { QuestionService } from "../../../services/question/question.service";
import { AnswerService } from "../../../services/answer/answer.service";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { color } from "../../../utils";

interface DetailProps {
    surveyId?: string | null;
    surveyName?: string;
    surveyType?: SurveyType;
    surveyDescription?: string;
    open: boolean;
    onClose: () => void;
}

const SurveyDetailDrawer: React.FC<DetailProps> = ({ surveyId, surveyName, surveyType, surveyDescription, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<string, AnswerResponse[]>>({});

    useEffect(() => {
        if (open && surveyId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const qRes = await QuestionService.getQuestionBySurveyId(surveyId);
                    const qList = qRes?.data?.data ?? [];
                    setQuestions(qList);
                    // Fetch answers for each question in parallel
                    const answerPromises = qList.map((q) => AnswerService.getAnswerByQuestionId(q.id));
                    const answerResList = await Promise.all(answerPromises);
                    const map: Record<string, AnswerResponse[]> = {};
                    answerResList.forEach((res, idx) => {
                        map[qList[idx].id] = res?.data?.data ?? [];
                    });
                    setAnswersMap(map);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, surveyId]);

    // const questionColumns = [
    //     { title: "Câu hỏi", dataIndex: "questionContent", key: "questionContent" },
    //     { title: "Loại", dataIndex: "questionType", key: "questionType" },
    //     { title: "Thứ tự", dataIndex: "positionOrder", key: "positionOrder", width: 80 },
    //     { title: "Mô tả", dataIndex: "description", key: "description" },
    // ];

    const answerColumns = [
        { title: "Phương án", dataIndex: "optionContent", key: "optionContent" },
        { title: "Điểm", dataIndex: "score", key: "score", width: 80 },
        { title: "Thứ tự", dataIndex: "positionOrder", key: "positionOrder", width: 80 },
    ];

    return (
        <Drawer
            title={`Chi tiết khảo sát: ${surveyName || ""}`}
            width={800}
            open={open}
            onClose={onClose}
            destroyOnClose
        >
            {loading ? (
                <Spin />
            ) : (
                <>
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Tên">{surveyName}</Descriptions.Item>
                        <Descriptions.Item label="Loại">
                            <Tag color={color.getSurveyTypeColor(surveyType!)} style={{ fontWeight: 500 }}>
                                {surveyType}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số câu hỏi">{questions.length}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">
                            <div dangerouslySetInnerHTML={{ __html: surveyDescription || '' }} />
                        </Descriptions.Item>
                    </Descriptions>

                    {questions.map((q) => (
                        <div key={q.id} className="mt-4">
                            <Table
                                title={() => q.questionContent}
                                dataSource={answersMap[q.id] ?? []}
                                columns={answerColumns}
                                pagination={false}
                                rowKey="id"
                                size="small"
                            />
                        </div>
                    ))}
                </>
            )}
        </Drawer>
    );
};

export default SurveyDetailDrawer; 