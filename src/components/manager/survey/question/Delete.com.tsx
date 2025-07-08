import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { QuestionService } from "../../../../services/question/question.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { helpers } from "../../../../utils";

interface Props {
    question: QuestionResponse;
    onSuccess: () => void;
    disabled?: boolean;
    className?: string;
}

const QuestionDeleteButton: React.FC<Props> = ({ question, onSuccess, disabled = false, className = "" }) => {
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await QuestionService.deleteQuestion(question.id);

            helpers.notificationMessage("Xóa câu hỏi thành công", "success");
            onSuccess();
        } catch (error: any) {
            console.error("Error deleting question:", error);
            let errorMessage = "Có lỗi xảy ra khi xóa câu hỏi";

            if (error?.response?.status === 404) {
                errorMessage = "Câu hỏi không tồn tại hoặc đã bị xóa.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Không thể xóa câu hỏi này.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popconfirm
            title="Xác nhận xóa câu hỏi"
            description={`Bạn có chắc chắn muốn xóa câu hỏi "${question.questionContent.length > 50 ? question.questionContent.substring(0, 50) + "..." : question.questionContent}"?`}
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            disabled={disabled || loading}
        >
            <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={loading}
                disabled={disabled}
                className={className}
                onClick={(e) => e.stopPropagation()}
                title="Xóa câu hỏi"
            />
        </Popconfirm>
    );
};

export default QuestionDeleteButton;
