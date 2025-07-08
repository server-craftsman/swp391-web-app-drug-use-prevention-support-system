import React from "react";
import { Button, Popconfirm, message } from "antd";
import { CategoryService } from "../../../services/category/category.service";
import type { DeleteCategoryRequest } from "../../../types/category/Category.req.type";

interface DeleteCategoryProps {
  categoryId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({
  categoryId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const params: DeleteCategoryRequest = { categoryId };
      await CategoryService.deleteCategory(params);
      message.success("Đã xóa danh mục!");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa danh mục thất bại!");
    }
  };

  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa danh mục này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteCategory;
