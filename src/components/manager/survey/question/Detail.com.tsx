import React from "react";
import { Drawer, Descriptions, Tag, Button } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
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
            title="Chi tiết câu hỏi"
            placement="right"
            open={open}
            onClose={onClose}
            width={600}
            destroyOnClose
            extra={
                <div className="flex gap-2">
                    {questionData && onEdit && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            size="small"
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                    <Button
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        size="small"
                    >
                        Đóng
                    </Button>
                </div>
            }
        >
            {questionData ? (
                <div className="space-y-6">
                    <Descriptions column={1} bordered size="small">

                        <Descriptions.Item label="Khảo sát">
                            <Tag color="blue" className="text-sm">
                                {getSurveyName(questionData.surveyId || '')}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Nội dung câu hỏi">
                            <div
                                className="whitespace-pre-wrap text-base leading-relaxed p-3 bg-gray-50 rounded prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: questionData.questionContent }}
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Loại câu hỏi">
                            <Tag color={getQuestionTypeColor(questionData.questionType)} className="text-sm">
                                {getQuestionTypeDisplay(questionData.questionType)}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Thứ tự">
                            <Tag color="purple" className="text-sm">
                                #{questionData.positionOrder}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ) : (
                <div className="flex justify-center items-center py-16">
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
