import React, { useState } from "react";
import { useCreateCategory } from "../../../hooks/useCategory";

interface CreateCategoryFormProps {
  onSuccess?: () => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onSuccess,
}) => {
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    createCategory(
      { name },
      {
        onSuccess: () => {
          setName("");
          if (onSuccess) onSuccess();
        },
        onError: () => {
          alert("Tạo danh mục thất bại!");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo danh mục mới
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
        className="w-full bg-gradient-to-r from-[#20558A] to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
      >
        {isPending ? "Đang tạo..." : "Tạo danh mục"}
      </button>
    </form>
  );
};

export default CreateCategoryForm;
