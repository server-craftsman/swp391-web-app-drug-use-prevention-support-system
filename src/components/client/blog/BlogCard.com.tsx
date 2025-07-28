import React from "react";
import { Card, Avatar } from "antd";
import type { Blog } from "../../../types/blog/Blog.res.type";

interface BlogCardProps {
  blog: Blog;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick }) => (
  <Card
    hoverable
    onClick={onClick}
    className="w-full rounded-2xl shadow-lg border-0 overflow-hidden"
    style={{
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
      margin: "16px", // Thêm margin để các card không dính nhau
      maxWidth: "650px", // Tăng từ max-w-sm (384px) lên 380px
      minHeight: "400px", // Thêm chiều cao tối thiểu
    }}
  >
    {/* Ảnh blog */}
    <div className="relative">
      {blog.blogImgUrl ? (
        <img
          src={blog.blogImgUrl}
          alt="Blog"
          className="w-full object-cover"
          style={{ height: "350px" }} // Tăng từ h-48 (192px) lên 220px
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
          }}
        />
      ) : (
        <div
          className="w-full bg-gray-200 flex items-center justify-center"
          style={{ height: "220px" }} // Tăng từ h-48 (192px) lên 220px
        >
          <span className="text-gray-400 text-lg">No Image</span>
        </div>
      )}

      {/* Date overlay */}
      <div
        className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-white text-sm font-medium"
        style={{ backgroundColor: "rgba(32, 85, 138, 0.9)" }}
      >
        {blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
          : ""}
      </div>
    </div>

    {/* Nội dung */}
    <div className="p-5">
      {" "}
      {/* Tăng padding từ p-4 lên p-5 */}
      {/* Tiêu đề */}
      <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">
        {" "}
        {/* Tăng margin-bottom */}
        {blog.title || "Không có tiêu đề"}
      </h3>
      {/* Mô tả ngắn */}
      <p className="text-gray-600 text-sm mb-5 line-clamp-3">
        {" "}
        {/* Tăng margin-bottom */}
        {blog.content || "Không có nội dung"}
      </p>
      {/* Footer: Avatar + User + Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            size={36} // Tăng từ 32 lên 36
            src={blog.userAvatar || undefined}
            style={{ backgroundColor: "#20558A" }}
          >
            {blog.fullName
              ? blog.fullName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </Avatar>
          <span className="text-sm text-gray-600 font-medium">
            {blog.fullName || "Không rõ tác giả"}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

export default BlogCard;
