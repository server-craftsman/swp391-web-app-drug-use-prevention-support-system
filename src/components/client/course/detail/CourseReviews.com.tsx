import React from "react";
import { Typography, Card, Avatar, Rate, Button } from "antd";

const { Title, Text, Paragraph } = Typography;

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  timeAgo: string;
  comment: string;
  avatarColor: string;
}

interface CourseReviewsProps {
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ 
  rating = 4.7, 
  totalReviews = 468,
  reviews = [
    {
      id: "1",
      userName: "Phi Nguyen H.",
      rating: 5,
      timeAgo: "2 tháng trước",
      comment: "Rất cảm ơn khóa học, rất dễ hiểu, sát với nội dung thực tế, dạy rất hấp thụ, miễn phí. Cảm ơn MS Thang Nguyen",
      avatarColor: "bg-blue-600"
    },
    {
      id: "2", 
      userName: "Tấn Đạt D.",
      rating: 5,
      timeAgo: "3 tuần trước",
      comment: "Cảm ơn a, khóa học này giúp e hiểu hơn về các khái niệm cơ bản trong nền. Hy vọng trong tương lai sẽ có thêt những khóa học hay hơn từ a",
      avatarColor: "bg-green-600"
    },
    {
      id: "3",
      userName: "Tài P.",
      rating: 5, 
      timeAgo: "2 tháng trước",
      comment: "Bài giảng rất dễ hiểu. Mong anh/chị sẽ ra nhiều phần về khóa học liên quan nhiều hơn sau này.",
      avatarColor: "bg-purple-600"
    },
    {
      id: "4",
      userName: "Tran V.",
      rating: 5,
      timeAgo: "2 tháng trước", 
      comment: "Xin cảm ơn con Bòa, cảm ơn anh đã tạo ra cái khóa học này. Hy vọng anh sẽ tạo ra cái khóa học free tiếp theo đây.",
      avatarColor: "bg-red-600"
    }
  ]
}) => {
  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
      <div className="mb-6">
        <Title level={3} className="text-gray-900 mb-2">
          <Rate disabled defaultValue={1} count={1} className="text-yellow-400 mr-2" />
          {rating} xếp hạng khóa học • {totalReviews} đánh giá
        </Title>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={review.id} className={`border-b border-gray-200 pb-6 ${index === reviews.length - 1 ? 'last:border-b-0' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar size={40} className={`${review.avatarColor} flex-shrink-0`}>
                  {review.userName.split(' ').map(name => name[0]).join('').toUpperCase()}
                </Avatar>
                <div>
                  <Text className="font-semibold text-gray-900 block">{review.userName}</Text>
                  <Rate disabled defaultValue={review.rating} className="text-yellow-400" style={{ fontSize: '12px' }} />
                  <Text className="text-gray-500 text-xs ml-2">{review.timeAgo}</Text>
                </div>
              </div>
              <Button type="text" size="small" className="text-gray-400">⋯</Button>
            </div>
            <Paragraph className="text-gray-700 text-sm mb-3">
              {review.comment}
            </Paragraph>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <Text>Bạn thấy hữu ích?</Text>
              <Button type="text" size="small" className="p-0 h-auto text-gray-500 hover:text-blue-600">👍</Button>
              <Button type="text" size="small" className="p-0 h-auto text-gray-500 hover:text-blue-600">👎</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button 
          type="default" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Hiển thị tất cả đánh giá
        </Button>
      </div>
    </Card>
  );
};

export default CourseReviews; 