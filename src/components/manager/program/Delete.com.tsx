import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ProgramService } from "../../../services/program/program.service";
import { helpers } from "../../../utils";
interface DeleteProps {
    programId: string | number;
    onSuccess: () => void;
}

const DeleteProgramButton: React.FC<DeleteProps> = ({ programId, onSuccess }) => {
    const handleDelete = async () => {
        try {
            await ProgramService.deleteProgram(String(programId));
            helpers.notificationMessage("Chương trình đã được xóa thành công", 'success')
            onSuccess();
        } catch {
            helpers.notificationMessage("Xóa chương trình thất bại", 'error')
        }
    };

    return (
        <Popconfirm title="Bạn có chắc chắn muốn xóa chương trình này?" onConfirm={handleDelete} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
    );
};

export default DeleteProgramButton;
