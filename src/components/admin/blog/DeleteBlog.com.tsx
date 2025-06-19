import React from "react";
import { Button, Popconfirm, message } from "antd";
import { BlogService } from "../../../services/blog/blog.service";
import type { DeleteBlogRequest } from "../../../types/blog/Blog.req.type";

interface DeleteBlogProps {
  blogId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>; // Thêm dòng này
}

const DeleteBlog: React.FC<DeleteBlogProps> = ({
  blogId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const params: DeleteBlogRequest = { id: blogId };
      await BlogService.deleteBlog(params);
      message.success("Đã xóa blog!");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa blog thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa blog này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteBlog;
