import React from "react";
import { Popconfirm, Button, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";

interface Props {
    answer: AnswerResponse;
    onSuccess: () => void;
    disabled?: boolean;
}

const AnswerDeleteButton: React.FC<Props> = ({ answer, onSuccess, disabled = false }) => {
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await AnswerService.deleteAnswer(answer.id);
            helpers.notificationMessage("Đã xoá đáp án", "success");
            onSuccess();
        } catch {
            helpers.notificationMessage("Xoá thất bại", "error");
        } finally { setLoading(false); }
    };

    const getAnswerPreview = () => {
        const content = answer.optionContent;
        return content.length > 50 ? content.substring(0, 50) + "..." : content;
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
                        <p className="text-sm text-gray-600">Đáp án: <span className="font-semibold" dangerouslySetInnerHTML={{ __html: `"${getAnswerPreview()}"` }}></span></p>
                    </div>
                </div>
            }
            description={
                <div className="mt-4 space-y-2">
                    <p className="text-gray-700">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa đáp án này?</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <ExclamationCircleOutlined className="text-red-500 mt-0.5" />
                            <div className="text-sm text-red-700">
                                <p className="font-medium mb-1">Cảnh báo:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Đáp án sẽ bị mất vĩnh viễn</li>
                                    <li>Không thể khôi phục sau khi xóa</li>
                                    <li>Điểm số sẽ bị mất</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }
            onConfirm={handleDelete}
            okText="Xóa đáp án"
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
            <Tooltip title={loading ? "Đang xóa..." : "Xóa đáp án"}>
                <Button
                    type="text"
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                    loading={loading}
                    disabled={disabled}
                    onClick={e => e.stopPropagation()}
                    className="hover:bg-red-50 hover:text-red-600 border-0 shadow-sm transition-all duration-200"
                    size="large"
                />
            </Tooltip>
        </Popconfirm>
    );
};

export default AnswerDeleteButton;
