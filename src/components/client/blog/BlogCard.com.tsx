import React from "react";
import { Card, Avatar, Typography } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Blog } from "../../../types/blog/Blog.res.type";

const { Text, Title } = Typography;
const { Meta } = Card;

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${blog.id}`);
  };

  // Truncate content for preview
  const getContentPreview = (content: string, maxLength = 150) => {
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  return (
    <Card
      hoverable
      className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl cursor-pointer"
      onClick={handleCardClick}
      cover={
        blog.blogImgUrl ? (
          <div className="h-48 overflow-hidden">
            <img
              alt={blog.title}
              src={blog.blogImgUrl}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-white text-6xl">📝</div>
          </div>
        )
      }
    >
      <div className="h-full flex flex-col">
        {/* Title */}
        <Title level={4} className="text-gray-800 mb-3 line-clamp-2">
          {blog.title}
        </Title>

        {/* Content Preview */}
        <Text className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {getContentPreview(blog.content)}
        </Text>

        {/* Author & Date */}
        <div className="mt-auto">
          <Meta
            avatar={
              blog.userAvatar ? (
                <Avatar src={blog.userAvatar} />
              ) : (
                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
              )
            }
            title={
              <Text strong className="text-gray-800">
                {blog.fullName || "Tác giả"}
              </Text>
            }
            description={
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarOutlined className="text-xs" />
                <Text className="text-xs">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
