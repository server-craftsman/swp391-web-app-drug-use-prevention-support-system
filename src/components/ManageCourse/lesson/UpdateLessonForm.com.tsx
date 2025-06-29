import React, { useState, useEffect } from "react";
import { useUpdateLesson } from "../../../hooks/useLesson";
import { BaseService } from "../../../app/api/base.service";
import type { Lesson } from "../../../types/lesson/Lesson.res.type";

interface UpdateLessonFormProps {
  lesson: Lesson;
  onSuccess: () => void;
}

const UpdateLessonForm: React.FC<UpdateLessonFormProps> = ({
  lesson,
  onSuccess,
}) => {
  const { mutate: updateLesson, isPending } = useUpdateLesson();

  const [title, setTitle] = useState(lesson.name);
  const [content, setContent] = useState(lesson.content || "");
  const [lessonType, setLessonType] = useState(lesson.lessonType || "");
  const [imageUrl, setImageUrl] = useState(lesson.imageUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    lesson.imageUrl || ""
  );
  const [fullTime, setFullTime] = useState<number>(lesson.fullTime || 1);
  const [positionOrder, setPositionOrder] = useState<number>(
    lesson.positionOrder || 0
  );

  useEffect(() => {
    setTitle(lesson.name);
    setContent(lesson.content || "");
    setLessonType(lesson.lessonType || "");
    setImageUrl(lesson.imageUrl || "");
    setPreviewImage(lesson.imageUrl || "");
    setFile(null);
    setFullTime(lesson.fullTime || 1);
    setPositionOrder(lesson.positionOrder || 0);
  }, [lesson]);

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

    if (!title.trim() || !lessonType.trim()) {
      alert("Vui lòng điền đầy đủ tên bài học và loại bài học.");
      return;
    }
    if (fullTime < 1) {
      alert("Thời lượng phải lớn hơn hoặc bằng 1.");
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

    const payload = {
      id: lesson.id,
      name: title,
      content,
      lessonType,
      imageUrl: finalImageUrl,
      videoUrl: "",
      fullTime,
      positionOrder,
      sessionId: lesson.sessionId,
      courseId: lesson.courseId,
    };

    updateLesson(payload, {
      onSuccess: () => {
        onSuccess();
      },
      onError: () => {
        alert("Cập nhật bài học thất bại.");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-800 text-center">
        Cập nhật bài học
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Tên bài học
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
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Loại bài học
        </label>
        <select
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Chọn loại</option>
          <option value="video">Video</option>
          <option value="document">Tài liệu</option>
          <option value="quiz">Trắc nghiệm</option>
        </select>
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

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Thời lượng (phút)
        </label>
        <input
          type="number"
          min={1}
          value={fullTime}
          onChange={(e) => setFullTime(Number(e.target.value))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Thứ tự</label>
        <input
          type="number"
          min={0}
          value={positionOrder}
          onChange={(e) => setPositionOrder(Number(e.target.value))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 transition"
      >
        {isPending ? "Đang cập nhật..." : "Cập nhật bài học"}
      </button>
    </form>
  );
};

export default UpdateLessonForm;
