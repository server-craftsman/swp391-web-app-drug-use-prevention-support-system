import { Popconfirm, Button, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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

const SurveyDeleteButton: React.FC<Props> = ({ survey, onSuccess, disabled = false, className }) => {
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
            title={
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <ExclamationCircleOutlined className="text-red-500 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Xác nhận xóa</h3>
                        <p className="text-sm text-gray-600">Khảo sát: <span className="font-semibold">"{survey.name}"</span></p>
                    </div>
                </div>
            }
            description={
                <div className="mt-4 space-y-2">
                    <p className="text-gray-700">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa khảo sát này?</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                            <div className="text-sm text-red-700">
                                <p className="font-medium mb-1">Cảnh báo:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Tất cả dữ liệu khảo sát sẽ bị mất vĩnh viễn</li>
                                    <li>Không thể khôi phục sau khi xóa</li>
                                    <li>Các câu hỏi và câu trả lời sẽ bị xóa</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }
            onConfirm={handleDelete}
            okText="Xóa khảo sát"
            cancelText="Hủy bỏ"
            okType="danger"
            disabled={disabled || loading}
            placement="topRight"
            okButtonProps={{
                danger: true,
                loading: loading,
                className: "bg-red-500 hover:bg-red-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
        >
            <Tooltip title={loading ? "Đang xóa..." : "Xóa khảo sát"}>
                <Button
                    type="text"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    danger
                    loading={loading}
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()}
                    className={`hover:bg-red-50 hover:text-red-600 border-0 shadow-sm transition-all duration-200 ${className || ''}`}
                    size="large"
                />
            </Tooltip>
        </Popconfirm>
    );
};

export default SurveyDeleteButton;
