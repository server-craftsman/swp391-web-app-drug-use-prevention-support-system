import React, { useState, useEffect } from "react";
import { useUpdateBlog } from "../../../hooks/useBlog";
import { BaseService } from "../../../app/api/base.service";
import type { Blog } from "../../../types/blog/Blog.res.type";

interface UpdateBlogFormProps {
  blog: Blog;
  onSuccess?: () => void;
}

const UpdateBlogForm: React.FC<UpdateBlogFormProps> = ({ blog, onSuccess }) => {
  const { mutate: updateBlog, isPending } = useUpdateBlog();
  const [title, setTitle] = useState(blog.title || ""); // Thêm state cho title
  const [content, setContent] = useState(blog.content);
  const [blogImgUrl, setBlogImgUrl] = useState(blog.blogImgUrl);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(blog.blogImgUrl);

  // Cập nhật lại state khi blog prop đổi
  useEffect(() => {
    setTitle(blog.title || "");
    setContent(blog.content);
    setBlogImgUrl(blog.blogImgUrl);
    setPreviewImage(blog.blogImgUrl);
    setFile(null);
  }, [blog]);

  // Xử lý chọn file và preview ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewImage(blogImgUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề blog");
      return;
    }

    if (!content.trim()) {
      alert("Vui lòng nhập nội dung blog");
      return;
    }

    let imgUrl = blogImgUrl;

    // Nếu có file mới, upload lên server
    if (file) {
      const uploadedUrl = await BaseService.uploadFile(file);
      if (uploadedUrl) {
        imgUrl = uploadedUrl;
        setBlogImgUrl(uploadedUrl);
      } else {
        alert("Upload ảnh thất bại");
        return;
      }
    }

    updateBlog(
      { id: blog.id, title, content, blogImgUrl: imgUrl }, // Thêm title vào payload
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: () => {
          alert("Cập nhật blog thất bại!");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white rounded-xl  space-y-6  border-gray-100"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
        Cập nhật blog
      </h2>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Tiêu đề Blog
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Nhập tiêu đề blog..."
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Nội dung Blog
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          rows={6}
          placeholder="Viết nội dung blog tại đây..."
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
              className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow"
            />
          )}
        </div>
        <input
          type="text"
          value={blogImgUrl}
          onChange={(e) => setBlogImgUrl(e.target.value)}
          className="mt-3 border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Hoặc dán URL ảnh (không bắt buộc nếu đã chọn file)"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
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
          "Cập nhật blog"
        )}
      </button>
    </form>
  );
};

export default UpdateBlogForm;
