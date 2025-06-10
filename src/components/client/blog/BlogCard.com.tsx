import React from "react";
import { Card, Avatar } from "antd";
import type { Blog } from "../../../types/blog/Blog.res.type";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => (
  <Card
    hoverable
    className="w-full max-w-3xl flex p-4 items-start shadow-md rounded-xl m-4"
  >
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-6 min-w-[200px] h-[250px] overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
        <img
          src={blog.blogImgUrl || "/no-image.png"}
          alt="Blog"
          className="w-full h-full object-cover block"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
          }}
        />
      </div>
      <div className="col-span-6 flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <Avatar>{blog.userId?.charAt(0).toUpperCase() || "U"}</Avatar>
          <div>
            <p className="font-semibold">
              {blog.userId ? `User: ${blog.userId}` : "Không rõ tác giả"}
            </p>
            <p className="text-sm text-gray-500">
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
                : ""}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-2 line-clamp-5">
          {blog.content || "Không có nội dung"}
        </p>
      </div>
    </div>
  </Card>
);

export default BlogCard;
