// components/session/DeleteSession.tsx
import React from "react";
import { Button, Popconfirm, message } from "antd";
import { SessionService } from "../../../../services/session/session.service";
import type { DeleteSessionRequest } from "../../../../types/session/Session.req.type";

interface DeleteSessionProps {
  sessionId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteSession: React.FC<DeleteSessionProps> = ({
  sessionId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const payload: DeleteSessionRequest = { id: sessionId };
      await SessionService.deleteSession(payload);
      message.success("Đã xóa phiên học");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa phiên học thất bại");
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa phiên học này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteSession;
