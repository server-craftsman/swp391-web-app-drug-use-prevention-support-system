import { Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { SurveyService } from "../../../services/survey/survey.service";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { helpers } from "../../../utils";

interface Props {
    survey: SurveyResponse;
    onSuccess: () => void;
    disabled?: boolean;
    className?: string;
}

const SurveyDeleteButton: React.FC<Props> = ({ survey, onSuccess, disabled = false }) => {
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            console.log("Deleting survey with ID:", survey.id);

            await SurveyService.deleteSurvey(survey.id);

            helpers.notificationMessage("Xóa khảo sát thành công", "success");
            onSuccess();
        } catch (error: any) {
            console.error("Error deleting survey:", error);

            let errorMessage = "Có lỗi xảy ra khi xóa khảo sát";

            if (error?.response?.status === 404) {
                errorMessage = "Khảo sát không tồn tại hoặc đã bị xóa";
            } else if (error?.response?.status === 403) {
                errorMessage = "Không có quyền xóa khảo sát này";
            } else if (error?.response?.status === 400) {
                errorMessage = "Không thể xóa khảo sát này (có thể đang được sử dụng)";
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
            title={`Xác nhận xóa khảo sát "${survey.name}"?`}
            description="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            disabled={disabled || loading}
            placement="topRight"
        >
            <Button
                size="small"
                type="text"
                icon={<DeleteOutlined />}
                danger
                title={loading ? "Đang xóa..." : "Xóa khảo sát"}
                onClick={(e) => e.stopPropagation()}
            />
        </Popconfirm>
    );
};

export default SurveyDeleteButton;
