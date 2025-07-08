import React, { useState, useEffect } from "react";
import { useUpdateCategory } from "../../../hooks/useCategory";
import type { Category } from "../../../types/category/Category.res.type";

interface UpdateCategoryFormProps {
  category: Category;
  onSuccess?: () => void;
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({
  category,
  onSuccess,
}) => {
  const { mutate: updateCategory, isPending } = useUpdateCategory();
  const [name, setName] = useState(category.name);

  useEffect(() => {
    setName(category.name);
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    updateCategory(
      { categoryId: category.id, name },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: () => {
          alert("Cập nhật danh mục thất bại!");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
        Cập nhật danh mục
      </h2>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Tên danh mục
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Nhập tên danh mục..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
      >
        {isPending ? "Đang cập nhật..." : "Cập nhật danh mục"}
      </button>
    </form>
  );
};

export default UpdateCategoryForm;
