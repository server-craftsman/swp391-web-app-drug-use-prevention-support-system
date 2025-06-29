import { useEffect, useState } from "react";
import { Input, Form, Button, message } from "antd";
import { useCreateLesson } from "../../../hooks/useLesson";
import { BaseService } from "../../../app/api/base.service";
import type { CreateLessonRequest } from "../../../types/lesson/Lesson.req.type";

interface CreateLessonFormProps {
  courseId: string;
  sessionId: string;
  onSuccess: () => void;
}

const defaultForm: CreateLessonRequest = {
  name: "",
  content: "",
  lessonType: "video",
  videoUrl: "",
  imageUrl: "",
  fullTime: 0,
  positionOrder: 0,
  courseId: "",
  sessionId: "",
};

const CreateLessonForm = ({
  courseId,
  sessionId,
  onSuccess,
}: CreateLessonFormProps) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createLesson = useCreateLesson();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
      form.setFieldsValue({ imageUrl: "" });
    } else {
      setFile(null);
      setPreviewImage("");
      form.setFieldsValue({ imageUrl: "" });
    }
  };

  const handleSubmit = async (values: CreateLessonRequest) => {
    setIsSubmitting(true);

    let finalImageUrl = values.imageUrl || "";

    if (file) {
      try {
        const uploadedUrl = await BaseService.uploadFile(file);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          message.error("Upload ảnh thất bại.");
          setIsSubmitting(false);
          return;
        }
      } catch {
        message.error("Upload ảnh thất bại.");
        setIsSubmitting(false);
        return;
      }
    }

    const payload: CreateLessonRequest = {
      ...values,
      courseId,
      sessionId,
      lessonType: "video", // ✅ luôn cố định là "video"
      imageUrl: finalImageUrl,
      videoUrl: "",
      fullTime: 0,
    };

    createLesson.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setFile(null);
        setPreviewImage("");
        setIsSubmitting(false);
        onSuccess();
      },
      onError: () => {
        message.error("Tạo bài học thất bại.");
        setIsSubmitting(false);
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue({ ...defaultForm });
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Tên bài học" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Nội dung" name="content" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Thứ tự hiển thị"
        name="positionOrder"
        rules={[{ required: true }]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item label="Ảnh minh họa">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="preview"
            className="mt-2 w-32 h-20 object-cover rounded border"
          />
        )}
        <Form.Item name="imageUrl" noStyle>
          <Input type="hidden" />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Tạo bài học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateLessonForm;
