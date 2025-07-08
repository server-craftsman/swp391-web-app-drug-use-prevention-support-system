import React from "react";
import { Drawer, Descriptions, Tag } from "antd";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";

interface Props {
    open: boolean;
    data: AnswerResponse | null;
    onClose: () => void;
}

const AnswerDetailDrawer: React.FC<Props> = ({ open, data, onClose }) => {
    return (
        <Drawer title="Chi tiết đáp án" placement="right" width={400} open={open} onClose={onClose} destroyOnClose>
            {data ? (
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="ID"><code>{data.id}</code></Descriptions.Item>
                    <Descriptions.Item label="Câu hỏi ID">{data.questionId}</Descriptions.Item>
                    <Descriptions.Item label="Phương án"><div dangerouslySetInnerHTML={{ __html: data.optionContent }} /></Descriptions.Item>
                    <Descriptions.Item label="Điểm"><Tag color="green">{data.score}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Thứ tự"><Tag color="blue">#{data.positionOrder}</Tag></Descriptions.Item>
                </Descriptions>
            ) : (
                <p>Không có dữ liệu</p>
            )}
        </Drawer>
    );
};

export default AnswerDetailDrawer;
