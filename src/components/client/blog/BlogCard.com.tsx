import React from "react";
import { Card } from "antd";
import type { Blog } from "../../../types/blog/BlogModel";
import { Avatar } from "antd";
interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => (
  <Card
    hoverable
    className="w-full max-w-3xl flex p-4 items-start shadow-md rounded-xl m-4"
  >
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-6 min-w-[200px] h-[250px] overflow-hidden rounded-md">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="col-span-6 flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <Avatar>{blog.author?.charAt(0) || "A"}</Avatar>
          <div>
            <p className="font-semibold">{blog.author}</p>
            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toISOString().split("T")[0]}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-1">{blog.title}</h3>

        <p className="text-gray-600 text-sm">{blog.summary || blog.content}</p>

        <div className="mt-2">
          <span className="bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded">
            {blog.targetAudience}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

export default BlogCard;
