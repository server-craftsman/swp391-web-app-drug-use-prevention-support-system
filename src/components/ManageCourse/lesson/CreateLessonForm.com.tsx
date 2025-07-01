import { useEffect, useState } from "react";
import { Input, Form, Button, message, Select } from "antd";
import { useCreateLesson } from "../../../hooks/useLesson";
import { BaseService } from "../../../app/api/base.service";
import { SessionService } from "../../../services/session/session.service";
import type { CreateLessonRequest } from "../../../types/lesson/Lesson.req.type";
import type { Course } from "../../../types/course/Course.res.type";
import type { Session } from "../../../types/session/Session.res.type";

const { Option } = Select;

interface CreateLessonFormProps {
  courses: Course[];
  onSuccess: () => void;
}

const CreateLessonForm = ({ courses, onSuccess }: CreateLessonFormProps) => {
  const [form] = Form.useForm();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  const [lessonType, setLessonType] = useState<"text" | "image" | "video">(
    "text"
  );

  const [file, setFile] = useState<File | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createLesson = useCreateLesson();

  useEffect(() => {
    if (selectedCourseId) {
      fetchSessions(selectedCourseId);
    } else {
      setFilteredSessions([]);
      setSelectedSessionId(null);
    }
  }, [selectedCourseId]);

  const fetchSessions = async (courseId: string) => {
    try {
      const res = await SessionService.getSessionByCourseId({
        CourseId: courseId,
      });
      const data = res.data?.data || [];
      setFilteredSessions(data);
      setSelectedSessionId(null);
    } catch {
      message.error("Lỗi khi tải phiên học");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewFileUrl(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreviewFileUrl("");
    }
  };

  const handleSubmit = async (values: any) => {
    if (!selectedCourseId) {
      message.error("Vui lòng chọn khóa học");
      return;
    }
    if (!selectedSessionId) {
      message.error("Vui lòng chọn phiên học");
      return;
    }
    if (!values.content || values.content.trim() === "") {
      message.error("Vui lòng nhập mô tả bài học");
      return;
    }
    if ((lessonType === "image" || lessonType === "video") && !file) {
      message.error(`Vui lòng upload file ${lessonType}`);
      return;
    }

    setIsSubmitting(true);

    let uploadedUrl = "";

    if (file) {
      try {
        const url = await BaseService.uploadFile(file);
        if (!url) throw new Error("Upload thất bại");
        uploadedUrl = url;
      } catch {
        message.error("Upload file thất bại.");
        setIsSubmitting(false);
        return;
      }
    }

    const payload: CreateLessonRequest = {
      name: values.name,
      content: values.content || "",
      positionOrder: values.positionOrder || 0,
      fullTime: 0,
      courseId: selectedCourseId,
      sessionId: selectedSessionId,
      lessonType,
      imageUrl: lessonType === "image" ? uploadedUrl : "",
      videoUrl: lessonType === "video" ? uploadedUrl : "",
    };

    createLesson.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setFile(null);
        setPreviewFileUrl("");
        setSelectedCourseId(null);
        setSelectedSessionId(null);
        setLessonType("text");
        setIsSubmitting(false);
        onSuccess();
      },
      onError: () => {
        message.error("Tạo bài học thất bại.");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo Bài Học Mới
      </h2>

      <Form.Item label="Khóa học" required>
        <Select
          placeholder="Chọn khóa học"
          allowClear
          value={selectedCourseId || undefined}
          onChange={setSelectedCourseId}
        >
          {courses.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Phiên học" required>
        <Select
          placeholder="Chọn phiên học"
          allowClear
          value={selectedSessionId || undefined}
          onChange={setSelectedSessionId}
          disabled={!selectedCourseId}
        >
          {filteredSessions.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Loại bài học" required>
        <Select value={lessonType} onChange={setLessonType}>
          <Option value="text">Text</Option>
          <Option value="image">Image</Option>
          <Option value="video">Video</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên bài học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên bài học" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      {lessonType === "image" && (
        <Form.Item label="Upload ảnh" required>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewFileUrl && (
            <img
              src={previewFileUrl}
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
            onChange={handleFileChange}
            className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewFileUrl && (
            <video
              controls
              src={previewFileUrl}
              className="mt-2 w-64 h-36 rounded border"
            />
          )}
        </Form.Item>
      )}

      <Form.Item
        label="Thứ tự hiển thị"
        name="positionOrder"
        rules={[
          { required: true, message: "Vui lòng nhập thứ tự hiển thị" },
          {
            type: "number",
            min: 0,
            transform: (value) => (value ? Number(value) : 0),
            message: "Thứ tự phải là số >= 0",
          },
        ]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          block
          className="w-full bg-gradient-to-r from-[#20558A] to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Tạo bài học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateLessonForm;
