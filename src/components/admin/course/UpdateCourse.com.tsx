import React, { useState, useEffect } from "react";
import type { Course } from "../../../types/course/Course.res.type";
import { useUpdateCourse } from "../../../hooks/useCourse";
import { BaseService } from "../../../app/api/base.service";

interface UpdateCourseFormProps {
  course: Course;
  onSuccess?: () => void; // <-- thêm onSuccess vào đây
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

  useEffect(() => {
    setTitle(course.name);
    setContent(course.content || "");
    setImageUrl(course.imageUrl || "");
    setPreviewImage(course.imageUrl || "");
    setFile(null);
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
      alert("Vui lòng điền đầy đủ tên và nội dung khóa học.");
      return;
    }

    let finalImageUrl = imageUrl;

    if (file) {
      const uploadedUrl = await BaseService.uploadFile(file);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        setImageUrl(uploadedUrl);
      } else {
        alert("Upload ảnh thất bại.");
        return;
      }
    }

    // Ép kiểu status cho đúng enum
    const status = course.status as "draft" | "published" | "archived";

    updateCourse(
      {
        id: course.id,
        name: title,
        content,
        imageUrl: finalImageUrl,
        categoryId: course.categoryId,
        status,
        targetAudience: course.targetAudience,
        videoUrl: course.videoUrl,
        price: course.price,
        discount: course.discount,
        slug: course.slug,
        updatedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess(); // gọi callback thành công
        },
        onError: () => {
          alert("Cập nhật khóa học thất bại.");
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
          Nội dung khóa học
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
          className="mt-3 border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Hoặc dán URL ảnh"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 transition"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Đang cập nhật...
          </span>
        ) : (
          "Cập nhật khóa học"
        )}
      </button>
    </form>
  );
};

export default UpdateCourseForm;
