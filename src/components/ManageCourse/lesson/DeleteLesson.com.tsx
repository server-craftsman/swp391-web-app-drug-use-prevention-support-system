// components/lesson/DeleteLesson.tsx
import React from "react";
import { Button, Popconfirm, message } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import type { DeleteLessonRequest } from "../../../types/lesson/Lesson.req.type";

interface DeleteLessonProps {
  lessonId: string;
  onDeleted: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteLesson: React.FC<DeleteLessonProps> = ({
  lessonId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const payload: DeleteLessonRequest = { id: lessonId };
      await LessonService.deleteLesson(payload);
      message.success("Đã xóa bài học");
      onDeleted();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Xóa bài học thất bại");
    }
  };

  return (
    <Popconfirm
      title="Bạn có chắc chắn muốn xóa bài học này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteLesson;
