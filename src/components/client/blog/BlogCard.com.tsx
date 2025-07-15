import React from "react";
import { Card, Avatar } from "antd";
import type { Blog } from "../../../types/blog/Blog.res.type";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => (
  <Card
    hoverable
    className="w-full max-w-xl mx-auto my-6 rounded-2xl shadow-md p-0 border border-gray-100"
    bodyStyle={{ padding: 0 }}
  >
    {/* Header: Avatar + User + Date */}
    <div className="flex items-center gap-3 px-5 pt-5 pb-2">
      <Avatar
        size={44}
        src={blog.userAvatar || undefined}
        style={{ backgroundColor: "#20558A" }}
      >
        {blog.fullName
          ? blog.fullName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
          : blog.userId?.charAt(0).toUpperCase() || "U"}
      </Avatar>
      <div>
        <div className="font-semibold text-base">
          {blog.fullName || "Không rõ tác giả"}
        </div>
        <div className="text-xs text-gray-500">
          {blog.createdAt
            ? new Date(blog.createdAt).toLocaleString("vi-VN")
            : ""}
        </div>
      </div>
    </div>
    {/* Nội dung */}
    <div className="px-5 py-4">
      {/* Thêm tiêu đề blog */}
      <div className="font-bold text-xl text-[#20558A] mb-2">
        {blog.title || "Không có tiêu đề"}
      </div>
      <p className="text-gray-800 text-base whitespace-pre-line break-words">
        {blog.content || "Không có nội dung"}
      </p>
    </div>
    {/* Ảnh blog */}
    {blog.blogImgUrl && (
      <div
        className="w-full bg-gray-100 flex items-center justify-center overflow-hidden"
        style={{ maxHeight: 320 }}
      >
        <img
          src={blog.blogImgUrl}
          alt="Blog"
          className="w-full object-cover"
          style={{ maxHeight: 320 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
          }}
        />
      </div>
    )}
  </Card>
);

export default BlogCard;
