import React, { useState, useEffect } from "react";
import type { Course } from "../../../types/course/Course.res.type";
import { useUpdateCourse } from "../../../hooks/useCourse";
import { BaseService } from "../../../app/api/base.service";
import { CategoryService } from "../../../services/category/category.service";
import type { Category } from "../../../types/category/Category.res.type";
import { message } from "antd";
import DropdownComponent from "../../common/dropdown.com"; // Giả sử bạn đã có sẵn component này

interface UpdateCourseFormProps {
  course: Course;
  onSuccess?: () => void;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({
  course,
  onSuccess,
}) => {
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  const [title, setTitle] = useState(course.name);
  const [content, setContent] = useState(course.content || "");
  const [imageUrl, setImageUrl] = useState(course.imageUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    course.imageUrl || ""
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    course.categoryId
  );
  const [selectedAudience, setSelectedAudience] = useState(
    course.targetAudience
  );

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.data?.data || []);
      } catch {
        message.error("Không thể tải danh mục!");
      } finally {
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setTitle(course.name);
    setContent(course.content || "");
    setImageUrl(course.imageUrl || "");
    setPreviewImage(course.imageUrl || "");
    setFile(null);
    setSelectedCategoryId(course.categoryId);
    setSelectedAudience(course.targetAudience);
  }, [course]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      message.warning("Vui lòng điền đầy đủ tên và nội dung khóa học.");
      return;
    }

    if (!selectedCategoryId) {
      message.warning("Vui lòng chọn danh mục.");
      return;
    }

    let finalImageUrl = imageUrl;

    if (file) {
      const uploadedUrl = await BaseService.uploadFile(file);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        setImageUrl(uploadedUrl);
      } else {
        message.error("Upload ảnh thất bại.");
        return;
      }
    }

    const status = course.status as "draft" | "published" | "archived";

    updateCourse(
      {
        id: course.id,
        name: title,
        content,
        imageUrl: finalImageUrl,
        categoryId: selectedCategoryId,
        status,
        targetAudience: selectedAudience,
        videoUrl: course.videoUrl,
        price: course.price,
        discount: course.discount,
        slug: course.slug,
        updatedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          message.success("Cập nhật thành công!");
          if (onSuccess) onSuccess();
        },
        onError: () => {
          message.error("Cập nhật khóa học thất bại.");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Cập nhật khóa học
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Tên khóa học
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Nội dung
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Danh mục
        </label>
        <DropdownComponent
          items={categories.map((cat) => ({
            key: cat.id,
            label: cat.name,
          }))}
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          placeholder="Chọn danh mục"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Đối tượng
        </label>
        <DropdownComponent
          items={[
            { key: "student", label: "Học sinh" },
            { key: "teacher", label: "Giáo viên" },
            { key: "parent", label: "Phụ huynh" },
          ]}
          value={selectedAudience}
          onChange={setSelectedAudience}
          placeholder="Chọn đối tượng"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Ảnh minh họa
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border shadow"
            />
          )}
        </div>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-3 border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Hoặc dán URL ảnh"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 transition"
      >
        {isPending ? "Đang cập nhật..." : "Cập nhật khóa học"}
      </button>
    </form>
  );
};

export default UpdateCourseForm;
