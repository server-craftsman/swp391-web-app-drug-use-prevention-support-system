import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Avatar, Divider, Spin, message } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { BlogService } from "../../../../services/blog/blog.service";
import type { Blog } from "../../../../types/blog/Blog.res.type";

const { Title, Text } = Typography;

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      setLoading(true);
      try {
        const res = await BlogService.getBlogById({ id: blogId });
        if (res.data?.success && res.data?.data) {
          setBlog(res.data.data as Blog);
        } else {
          message.error("Không tìm thấy bài viết");
          navigate("/blog");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        message.error("Lỗi khi tải bài viết");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
        <span className="ml-3 text-lg">Đang tải bài viết...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">📝</div>
          <p className="text-xl text-gray-500">Không tìm thấy bài viết</p>
          <Button
            type="primary"
            onClick={() => navigate("/blog")}
            className="mt-4"
          >
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Blog Image */}
          {blog.blogImgUrl && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={blog.blogImgUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <Title level={1} className="text-gray-800 mb-6">
              {blog.title}
            </Title>

            {/* Author & Date Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                {blog.userAvatar ? (
                  <Avatar
                    src={blog.userAvatar}
                    size={48}
                    className="border-2 border-blue-100"
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    size={48}
                    className="bg-blue-500"
                  />
                )}
                <div>
                  <Text strong className="text-gray-800 text-base">
                    {blog.fullName || "Tác giả"}
                  </Text>
                  <div className="text-gray-500 text-sm">Người viết</div>
                </div>
              </div>

              <Divider type="vertical" className="h-12" />

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarOutlined />
                <Text className="text-sm">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </div>
            </div>

            <Divider />

            {/* Blog Content */}
            <div className="mt-8">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
                dangerouslySetInnerHTML={{
                  __html: blog.content || "Nội dung đang được cập nhật...",
                }}
              />
            </div>

            {/* Update Info */}
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Text className="text-gray-500 text-sm">
                  Cập nhật lần cuối:{" "}
                  {new Date(blog.updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Back to List Button */}
        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/blog")}
            className="bg-[#20558A]"
          >
            Xem thêm bài viết khác
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
