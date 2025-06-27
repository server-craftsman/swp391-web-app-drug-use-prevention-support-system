import React, { useState } from "react";
import {
  Tabs,
  Typography,
  List,
  Rate,
  Avatar,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../types/course/Course.res.type";

const { Paragraph } = Typography;
const { TextArea } = Input;

interface TabsComponentProps {
  course: Course;
  author?: string;
}

// Giả lập user, bạn nên lấy từ context/store thật sự
const currentUser = {
  name: "Nguyễn Văn C",
  avatar: "",
  isLoggedIn: true, // Đổi thành false để test chưa login
};

const TabsComponent: React.FC<TabsComponentProps> = ({ course, author }) => {
  const navigate = useNavigate();

  const curriculum = [
    "Giới thiệu khóa học & mục tiêu",
    "Chủ đề 1: Nhận diện ma túy",
    "Chủ đề 2: Kỹ năng phòng tránh",
    "Chủ đề 3: Hỗ trợ & tư vấn",
    "Tổng kết & đánh giá cuối khóa",
  ];

  const [reviews, setReviews] = useState([
    {
      user: "Nguyễn Văn A",
      avatar: "",
      rating: 5,
      comment: "Khóa học rất bổ ích, nội dung dễ hiểu và thực tế.",
    },
    {
      user: "Trần Thị B",
      avatar: "",
      rating: 4,
      comment: "Giảng viên nhiệt tình, tài liệu đầy đủ.",
    },
  ]);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = (values: any) => {
    setSubmitting(true);
    setTimeout(() => {
      setReviews([
        {
          user: currentUser.name,
          avatar: currentUser.avatar,
          rating: values.rating,
          comment: values.comment,
        },
        ...reviews,
      ]);
      form.resetFields();
      setSubmitting(false);
      message.success("Cảm ơn bạn đã đánh giá!");
    }, 600);
  };

  return (
    <>
      {author && (
        <div style={{ marginBottom: 12, color: "#888" }}>
          <b>Tác giả:</b> {author}
        </div>
      )}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Course Insights",
            children: (
              <div>
                <b style={{ fontSize: 16, display: "block", marginBottom: 8 }}>
                  Chi tiết khóa học
                </b>
                <Paragraph style={{ margin: 0 }}>{course.content}</Paragraph>
              </div>
            ),
          },
          {
            key: "2",
            label: "Course Contents",
            children: (
              <List
                size="large"
                header={<b>Lộ trình học</b>}
                dataSource={curriculum}
                renderItem={(item, idx) => (
                  <List.Item>
                    <b>Bài {idx + 1}:</b> {item}
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "3",
            label: "Course Review",
            children: (
              <div>
                {currentUser.isLoggedIn ? (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{
                      marginBottom: 24,
                      background: "#fafafa",
                      padding: 16,
                      borderRadius: 8,
                    }}
                  >
                    <Form.Item
                      name="rating"
                      label="Đánh giá"
                      rules={[
                        { required: true, message: "Vui lòng chọn số sao!" },
                      ]}
                    >
                      <Rate />
                    </Form.Item>
                    <Form.Item
                      name="comment"
                      label="Nhận xét"
                      rules={[
                        { required: true, message: "Vui lòng nhập nhận xét!" },
                      ]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="Nhận xét của bạn về khóa học..."
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        Gửi đánh giá
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: 16,
                      background: "#fffbe6",
                      border: "1px solid #ffe58f",
                      borderRadius: 8,
                    }}
                  >
                    <b>Bạn cần đăng nhập để gửi đánh giá.</b>{" "}
                    <Button type="link" onClick={() => navigate("/login")}>
                      Đăng nhập
                    </Button>
                  </div>
                )}

                <List
                  itemLayout="horizontal"
                  dataSource={reviews}
                  header={<b>Đánh giá của người học</b>}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar>
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.user} />
                            ) : (
                              item.user.charAt(0)
                            )}
                          </Avatar>
                        }
                        title={
                          <>
                            {item.user}{" "}
                            <Rate
                              disabled
                              defaultValue={item.rating}
                              style={{ fontSize: 14, marginLeft: 8 }}
                            />
                          </>
                        }
                        description={item.comment}
                      />
                    </List.Item>
                  )}
                />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default TabsComponent;
