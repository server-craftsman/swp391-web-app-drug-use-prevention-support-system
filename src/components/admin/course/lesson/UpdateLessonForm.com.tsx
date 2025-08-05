import { useEffect, useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";
import type { Session } from "../../../../types/session/Session.res.type";
import type { Lesson } from "../../../../types/lesson/Lesson.res.type";
import { useUpdateLesson } from "../../../../hooks/useLesson";
import { BaseService } from "../../../../app/api/base.service";
import { SessionService } from "../../../../services/session/session.service";
import Editor from "../../../common/Editor.com";

const { Option } = Select;

interface UpdateLessonFormProps {
  lesson: Lesson;
  courses: Course[];
  onSuccess: () => void;
}

const UpdateLessonForm = ({
  lesson,
  courses,
  onSuccess,
}: UpdateLessonFormProps) => {
  const [form] = Form.useForm();
  const { mutate: updateLesson, isPending } = useUpdateLesson();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  const [lessonType, setLessonType] = useState<"text" | "image" | "video">(
    "text"
  );
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  // Khi lesson thay đổi, set lại toàn bộ giá trị vào form và state
  useEffect(() => {
    if (!lesson) return;

    form.setFieldsValue({
      name: lesson.name,
      content: lesson.content,
      positionOrder: lesson.positionOrder,
      lessonType: lesson.lessonType,
      courseId: lesson.courseId,
      sessionId: lesson.sessionId,
    });

    setLessonType(lesson.lessonType as "text" | "image" | "video");
    setPreviewImageUrl(lesson.imageUrl || "");
    setPreviewVideoUrl(lesson.videoUrl || "");
    setSelectedCourseId(lesson.courseId);
    setSelectedSessionId(lesson.sessionId);
    setFileImage(null);
    setFileVideo(null);
  }, [lesson, form]);

  // Khi chọn lại khóa học, load lại danh sách session
  useEffect(() => {
    if (!selectedCourseId) {
      setFilteredSessions([]);
      setSelectedSessionId(null);
      return;
    }

    SessionService.getSessionByCourseId({ CourseId: selectedCourseId })
      .then((res) => {
        const data = res.data || [];
        setFilteredSessions(data.data);
        setSelectedSessionId(
          selectedCourseId === lesson.courseId ? lesson.sessionId : null
        );
      })
      .catch(() => {
        message.error("Không thể tải danh sách phiên học.");
        setFilteredSessions([]);
      });
  }, [selectedCourseId, lesson]);

  // Khi đổi loại bài học, reset các trường liên quan
  const handleLessonTypeChange = (type: "text" | "image" | "video") => {
    setLessonType(type);
    setFileImage(null);
    setFileVideo(null);
    setPreviewImageUrl("");
    setPreviewVideoUrl("");
    form.setFieldValue("lessonType", type);
    // Không reset content ở đây để giữ lại nội dung khi mở form update
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFileImage(selected);
      setPreviewImageUrl(URL.createObjectURL(selected));
    } else {
      setFileImage(null);
      setPreviewImageUrl(lesson.imageUrl || "");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFileVideo(selected);
      setPreviewVideoUrl(URL.createObjectURL(selected));
    } else {
      setFileVideo(null);
      setPreviewVideoUrl(lesson.videoUrl || "");
    }
  };

  const handleSubmit = async (values: any) => {
    if (!selectedCourseId || !selectedSessionId) {
      message.error("Vui lòng chọn khóa học và phiên học.");
      return;
    }

    // Validation theo lesson type
    if (lessonType === "text") {
      if (!values.content?.trim()) {
        return message.error("Vui lòng nhập nội dung mô tả.");
      }
    } else if (lessonType === "image") {
      if (!fileImage && !previewImageUrl) {
        return message.error("Vui lòng upload ảnh.");
      }
    } else if (lessonType === "video") {
      if (!fileVideo && !previewVideoUrl) {
        return message.error("Vui lòng upload video.");
      }
    }

    // Xử lý file upload tương ứng với lessonType
    let uploadedImageUrl = previewImageUrl;
    let uploadedVideoUrl = previewVideoUrl;

    if (lessonType === "image" && fileImage) {
      try {
        const url = await BaseService.uploadFile(fileImage);
        if (!url) throw new Error();
        uploadedImageUrl = url;
      } catch {
        message.error("Tải ảnh thất bại.");
        return;
      }
    }

    if (lessonType === "video" && fileVideo) {
      try {
        const url = await BaseService.uploadFile(fileVideo);
        if (!url) throw new Error();
        uploadedVideoUrl = url;
      } catch {
        message.error("Tải video thất bại.");
        return;
      }
    }

    updateLesson(
      {
        id: lesson.id,
        name: values.name,
        content: values.content || "",
        positionOrder: values.positionOrder,
        fullTime: 0,
        courseId: values.courseId,
        sessionId: values.sessionId,
        lessonType: values.lessonType,
        imageUrl: lessonType === "image" ? uploadedImageUrl : "",
        videoUrl: lessonType === "video" ? uploadedVideoUrl : "",
      },
      {
        onSuccess: () => {
          message.success("Cập nhật thành công!");
          onSuccess();
        },
        onError: () => {
          message.error("Cập nhật thất bại.");
        },
      }
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Cập Nhập Bài Học
      </h2>

      <Form.Item
        name="courseId"
        label="Khóa học"
        rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
      >
        <Select
          onChange={(val) => setSelectedCourseId(val)}
          value={selectedCourseId || undefined}
        >
          {courses.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="sessionId"
        label="Phiên học"
        rules={[{ required: true, message: "Vui lòng chọn phiên học" }]}
      >
        <Select
          onChange={(val) => setSelectedSessionId(val)}
          value={selectedSessionId || undefined}
          disabled={!selectedCourseId}
        >
          {filteredSessions.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="lessonType" label="Loại bài học" required>
        <Select value={lessonType} onChange={handleLessonTypeChange}>
          <Option value="text">Text</Option>
          <Option value="image">Image</Option>
          <Option value="video">Video</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên bài học"
        rules={[{ required: true, message: "Vui lòng nhập tên bài học" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="content"
        label="Mô tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <Editor />
      </Form.Item>

      {lessonType === "image" && (
        <Form.Item label="Upload ảnh" required>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewImageUrl && (
            <img
              src={previewImageUrl}
              alt="preview"
              className="mt-2 w-32 h-20 object-cover rounded border"
            />
          )}
        </Form.Item>
      )}

      {lessonType === "video" && (
        <Form.Item label="Upload video" required>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewVideoUrl && (
            <video
              controls
              src={previewVideoUrl}
              className="mt-2 w-64 h-36 rounded border"
            />
          )}
        </Form.Item>
      )}

      <Form.Item
        name="positionOrder"
        label="Thứ tự hiển thị"
        rules={[
          { required: true, message: "Vui lòng nhập thứ tự" },
          {
            type: "number",
            min: 0,
            transform: (val) => (val ? Number(val) : 0),
            message: "Thứ tự phải >= 0",
          },
        ]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          block
          className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Cập nhật bài học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateLessonForm;
