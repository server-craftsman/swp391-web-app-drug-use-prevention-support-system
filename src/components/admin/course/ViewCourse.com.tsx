import React, { useEffect, useState } from "react";
import {
  Modal,
  Tag,
  Divider,
  Typography,
  List,
  Spin,
  Image,
  message,
  Button,
} from "antd";
import { CourseService } from "../../../services/course/course.service";
import type { CourseDetailResponse } from "../../../types/course/Course.res.type";
import { CourseStatus } from "../../../app/enums/courseStatus.enum";
import { CourseTargetAudience } from "../../../app/enums/courseTargetAudience.enum";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";

const { Title, Text } = Typography;

interface ViewCourseProps {
  courseId: string;
  open: boolean;
  onClose: () => void;
}

const statusColorMap: Record<string, string> = {
  [CourseStatus.PUBLISHED]: "green",
  [CourseStatus.ARCHIVED]: "orange",
  [CourseStatus.DRAFT]: "gray",
};

const targetAudienceLabel: Record<string, string> = {
  [CourseTargetAudience.STUDENT]: "Học sinh",
  [CourseTargetAudience.UNIVERSITY_STUDENT]: "Sinh viên",
  [CourseTargetAudience.PARENT]: "Phụ huynh",
  [CourseTargetAudience.GENERAL_PUBLIC]: "Cộng đồng",
};

const riskLevelLabel: Record<string, string> = {
  [RiskLevel.LOW]: "Thấp",
  [RiskLevel.MEDIUM]: "Trung bình",
  [RiskLevel.HIGH]: "Cao",
};

const WORD_LIMIT = 60;

function getWordsFromHTML(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean);
}

const ViewCourse: React.FC<ViewCourseProps> = ({ courseId, open, onClose }) => {
  const [data, setData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (open && courseId) {
      fetchCourse();
    }
    // eslint-disable-next-line
  }, [courseId, open]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await CourseService.getCourseById({ id: courseId });
      if (res.data.success && res.data) {
        setData(res.data.data as CourseDetailResponse);
      } else {
        message.error("Không tìm thấy thông tin khóa học.");
        setData(null);
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", err);
      message.error("Lỗi khi kết nối tới server.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={
        <span className="text-2xl font-bold text-gray-800">
          Chi tiết khóa học
        </span>
      }
      width={900}
      footer={null}
      className="rounded-lg shadow-xl"
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : !data ? (
        <div className="text-center text-red-600 py-12 font-semibold text-lg">
          Không tìm thấy dữ liệu khóa học.
        </div>
      ) : (
        <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
          {/* Tên khóa học */}
          <div>
            <Title
              level={4}
              className="!mb-2 !text-2xl text-gray-900 font-semibold"
            >
              {data.name}
            </Title>
            <div className="flex flex-wrap gap-3 items-center">
              <Tag
                color={statusColorMap[data.status] || "gray"}
                className="text-sm px-3 py-1 rounded-full"
              >
                {data.status?.toUpperCase()}
              </Tag>
              <Tag color="blue" className="text-sm px-3 py-1 rounded-full">
                {targetAudienceLabel[data.targetAudience] ||
                  data.targetAudience}
              </Tag>
              <Tag color="purple" className="text-sm px-3 py-1 rounded-full">
                {riskLevelLabel[data.riskLevel] || data.riskLevel}
              </Tag>
              <Text type="secondary" className="text-sm text-gray-500">
                Ngày tạo: {new Date(data.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </div>
          </div>

          {/* Giá và giảm giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <Text strong className="text-gray-700">
                Giá:
              </Text>{" "}
              <span className="text-lg font-medium text-green-600">
                {data.price.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div>
              <Text strong className="text-gray-700">
                Giảm giá:
              </Text>{" "}
              {data.discount > 0 ? (
                <Tag color="red" className="text-sm px-3 py-1 rounded-full">
                  -{data.discount}%
                </Tag>
              ) : (
                <Text className="text-gray-500">Không</Text>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span style={{ fontWeight: 600, color: "#555" }}>Mô tả:</span>
            <div className="text-gray-600 mt-2 leading-relaxed">
              {(() => {
                const words = getWordsFromHTML(data.content || "");
                const isLong = words.length > WORD_LIMIT;
                let shortHTML = data.content;
                if (isLong && !expanded) {
                  const shortText =
                    words.slice(0, WORD_LIMIT).join(" ") + "...";
                  shortHTML = `<span>${shortText}</span>`;
                }
                return (
                  <>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: expanded || !isLong ? data.content : shortHTML,
                      }}
                    />
                    {isLong && (
                      <Button
                        type="link"
                        onClick={() => setExpanded((prev) => !prev)}
                        style={{ paddingLeft: 8, fontWeight: 500 }}
                      >
                        {expanded ? "Thu gọn" : "Xem thêm"}
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Ảnh */}
          {data.imageUrls?.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Text strong className="text-gray-700">
                Ảnh khóa học:
              </Text>
              <div className="flex gap-3 mt-3 flex-wrap">
                {data.imageUrls.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    width={120}
                    height={90}
                    className="rounded-md shadow-sm hover:shadow-md transition-shadow"
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {data.videoUrls?.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Text strong className="text-gray-700">
                Video:
              </Text>
              <div className="mt-2 space-y-2">
                {data.videoUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline block transition-colors"
                  >
                    Xem Video {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Session list */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Divider
              orientation="left"
              className="!text-gray-700 !font-semibold"
            >
              Danh sách Session
            </Divider>
            {data.sessionList?.length ? (
              <List
                size="small"
                bordered
                className="bg-gray-50 rounded-md"
                dataSource={data.sessionList}
                renderItem={(session) => (
                  <List.Item className="hover:bg-gray-100 transition-colors">
                    <div className="w-full">
                      <Text strong className="text-gray-800">
                        {session.name}
                      </Text>
                      : <span className="text-gray-600">{session.content}</span>
                      {/* Danh sách Lesson trong mỗi Session */}
                      <Divider
                        orientation="left"
                        className="!text-gray-700 !font-semibold"
                      >
                        Danh sách Lesson
                      </Divider>
                      {session.lessonList && session.lessonList.length > 0 ? (
                        <List
                          size="small"
                          className="mt-3 ml-4 bg-white rounded-md shadow-inner"
                          dataSource={session.lessonList}
                          bordered
                          renderItem={(lesson, idx) => {
                            // Xử lý rút gọn content cho mỗi lesson
                            const words = getWordsFromHTML(
                              lesson.content || ""
                            );
                            const isLong = words.length > WORD_LIMIT;
                            let shortHTML = lesson.content;
                            const [expandedLesson, setExpandedLesson] =
                              useState(false);

                            if (isLong && !expandedLesson) {
                              const shortText =
                                words.slice(0, WORD_LIMIT).join(" ") + "...";
                              shortHTML = `<span>${shortText}</span>`;
                            }

                            return (
                              <List.Item className="hover:bg-gray-50 transition-colors">
                                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <b className="text-gray-800">
                                      {idx + 1}. {lesson.name}
                                    </b>{" "}
                                    <span className="text-gray-500">
                                      ({lesson.lessonType})
                                    </span>
                                    <div className="text-gray-600 text-sm mt-1">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            expandedLesson || !isLong
                                              ? lesson.content
                                              : shortHTML,
                                        }}
                                      />
                                      {isLong && (
                                        <Button
                                          type="link"
                                          size="small"
                                          onClick={() =>
                                            setExpandedLesson((prev) => !prev)
                                          }
                                          style={{
                                            paddingLeft: 8,
                                            fontWeight: 500,
                                          }}
                                        >
                                          {expandedLesson
                                            ? "Thu gọn"
                                            : "Xem thêm"}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  {/* Hiển thị ảnh nếu là Image lesson */}
                                  {lesson.lessonType === "Image" &&
                                    lesson.imageUrl && (
                                      <Image
                                        src={lesson.imageUrl}
                                        alt="lesson-img"
                                        width={80}
                                        height={60}
                                        className="rounded-md shadow-sm hover:shadow-md transition-shadow"
                                        style={{
                                          objectFit: "cover",
                                          marginTop: 6,
                                        }}
                                      />
                                    )}
                                </div>
                              </List.Item>
                            );
                          }}
                        />
                      ) : (
                        <div className="text-gray-500 italic mt-2 ml-4">
                          Không có bài học nào.
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-gray-500 italic">Không có session nào.</div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewCourse;
