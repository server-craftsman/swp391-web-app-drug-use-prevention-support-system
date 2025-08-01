import React, { useState, useRef, useEffect } from "react";
import { BaseService } from "../../../app/api/base.service";
import { useCreateCourse } from "../../../hooks/useCourse";
import type { CreateCourseRequest } from "../../../types/course/Course.req.type";
import type { Category } from "../../../types/category/Category.res.type";
import { message } from "antd";
import { CategoryService } from "../../../services/category/category.service";
import { CourseStatus } from "../../../app/enums/courseStatus.enum";
import { CourseTargetAudience } from "../../../app/enums/courseTargetAudience.enum";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";
import Editor from "../../common/Editor.com";

const defaultState: CreateCourseRequest = {
  name: "",
  categoryId: "",
  content: "",
  status: CourseStatus.DRAFT,
  targetAudience: CourseTargetAudience.STUDENT,
  riskLevel: RiskLevel.LOW,
  videoUrls: [],
  imageUrls: [],
  price: 0,
  discount: 0,
  createdAt: "",
  updatedAt: "",
  slug: "",
};

interface CreateCourseFormProps {
  onSuccess?: () => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ onSuccess }) => {
  const { mutate: createCourse, isPending } = useCreateCourse();
  const [form, setForm] = useState<CreateCourseRequest>(defaultState);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const res = await CategoryService.getAllCategories({
          pageNumber: 1,
          pageSize: 100,
        });
        setCategories(res.data?.data || []);
      } catch {
        message.error("Không thể tải danh mục!");
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewImage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.content.trim()) {
      message.warning("Vui lòng nhập tên và nội dung khóa học!");
      return;
    }

    if (!form.categoryId) {
      message.warning("Vui lòng chọn danh mục!");
      return;
    }

    if (!form.targetAudience) {
      message.warning("Vui lòng chọn đối tượng!");
      return;
    }

    if (!form.riskLevel) {
      message.warning("Vui lòng chọn mức độ rủi ro!");
      return;
    }

    if (!form.status) {
      message.warning("Vui lòng chọn trạng thái khóa học!");
      return;
    }

    let imageUrlsList = form.imageUrls;

    if (file) {
      const uploadedUrl = await BaseService.uploadFile(file);
      if (uploadedUrl) {
        imageUrlsList = [uploadedUrl];
      } else {
        message.error("Upload ảnh thất bại!");
        return;
      }
    }

    const now = new Date().toISOString();

    // Đảm bảo truyền đúng enum lên backend
    const payload: CreateCourseRequest = {
      ...form,
      content: form.content || "",
      imageUrls: imageUrlsList,
      videoUrls: form.videoUrls || [],
      createdAt: form.createdAt || now,
      updatedAt: form.updatedAt || now,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      targetAudience: form.targetAudience as CourseTargetAudience,
      riskLevel: form.riskLevel as RiskLevel,
      status: form.status as CourseStatus,
    };

    console.log("Payload gửi lên:", payload); // debug

    createCourse(payload, {
      onSuccess: () => {
        message.success("Tạo khóa học thành công!");
        setForm(defaultState);
        setFile(null);
        setPreviewImage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo khóa học mới
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Tên khóa học
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          placeholder="Nhập tên khóa học"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Nội dung khóa học
        </label>
        <Editor value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Danh mục
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          required
          disabled={catLoading}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Ảnh minh họa
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Xem trước"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Giá (VNĐ)
          </label>
          <input
            name="price"
            type="number"
            min={0}
            value={form.price}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Giảm giá (0 - 100)
          </label>
          <input
            name="discount"
            type="number"
            step={0.01}
            min={0}
            max={100}
            value={form.discount}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Đối tượng
        </label>
        <select
          name="targetAudience"
          value={form.targetAudience}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          required
        >
          <option value="">-- Chọn đối tượng --</option>
          <option value={CourseTargetAudience.STUDENT}>Học sinh</option>
          <option value={CourseTargetAudience.UNIVERSITY_STUDENT}>
            Sinh viên
          </option>
          <option value={CourseTargetAudience.PARENT}>Phụ huynh</option>
          <option value={CourseTargetAudience.GENERAL_PUBLIC}>Cộng đồng</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Mức độ rủi ro
        </label>
        <select
          name="riskLevel"
          value={form.riskLevel}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          required
        >
          <option value="">-- Chọn mức độ rủi ro --</option>
          <option value={RiskLevel.LOW}>Thấp</option>
          <option value={RiskLevel.MEDIUM}>Trung bình</option>
          <option value={RiskLevel.HIGH}>Cao</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Trạng thái khóa học
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          required
        >
          <option value="">-- Chọn trạng thái --</option>
          <option value={CourseStatus.DRAFT}>Nháp</option>
          <option value={CourseStatus.PUBLISHED}>Công khai</option>
          <option value={CourseStatus.ARCHIVED}>Lưu trữ</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Đang tạo...
          </span>
        ) : (
          "Tạo khóa học"
        )}
      </button>
    </form>
  );
};

export default CreateCourseForm;
