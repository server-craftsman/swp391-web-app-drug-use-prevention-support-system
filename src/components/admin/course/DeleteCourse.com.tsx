import React from "react";
import { Button, Popconfirm, message } from "antd";
import { CourseService } from "../../../services/course/course.service";
import type { DeleteCourseRequest } from "../../../types/course/Course.req.type";

interface DeleteCourseProps {
  courseId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteCourse: React.FC<DeleteCourseProps> = ({
  courseId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const params: DeleteCourseRequest = { id: courseId };
      await CourseService.deleteCourse(params);
      message.success("Đã xóa khóa học!");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa khóa học thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa khóa học này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteCourse;
