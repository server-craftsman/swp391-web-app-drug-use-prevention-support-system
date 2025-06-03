import React from "react";
import BlogCard from "./BlogCard.com";
import blogData from "../../../data/blog.json";
import type { Blog } from "../../../types/blog/BlogModel";

const typedBlogData = blogData as Blog[];
export default function BlogList() {
  return (
    <>
      <div className="flex flex-col items-center ">
        {typedBlogData.map((blog) => (
          <BlogCard blog={blog} key={blog.id} />
        ))}
      </div>
    </>
  );
}
