import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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

    return (
        <Popconfirm title="Xoá đáp án?" onConfirm={handleDelete} okText="Xoá" cancelText="Huỷ" okType="danger" disabled={disabled || loading}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} loading={loading} disabled={disabled} onClick={e => e.stopPropagation()} />
        </Popconfirm>
    );
};

export default AnswerDeleteButton;
