// THÊM MỚI: import Select và kiểu dữ liệu Course
import { Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
import type { Session } from "../../../../types/session/Session.res.type";
import { useUpdateSession } from "../../../../hooks/useSession";
import type { UpdateSessionRequest } from "../../../../types/session/Session.req.type";
import type { Course } from "../../../../types/course/Course.res.type"; // THÊM MỚI

// CẬP NHẬT: Thêm `courses` vào props
interface UpdateSessionFormProps {
  session: Session;
  onSuccess: () => void;
  courses: Course[]; // THÊM MỚI: Prop để nhận danh sách khóa học
}

// CẬP NHẬT: Nhận `courses` từ props
const UpdateSessionForm = ({
  session,
  onSuccess,
  courses = [],
}: UpdateSessionFormProps) => {
  const [form] = Form.useForm();
  const updateSessionMutation = useUpdateSession();

  useEffect(() => {
    // CẬP NHẬT: Thêm courseId vào để form tự động chọn đúng course khi mở
    if (session) {
      form.setFieldsValue({
        name: session.name,
        content: session.content,
        positionOrder: session.positionOrder,
        courseId: session.courseId, // THÊM MỚI
      });
    }
  }, [session, form]);

  useEffect(() => {
    if (updateSessionMutation.isSuccess) {
      onSuccess();
      // Không cần resetFields ở đây nữa vì Modal sẽ đóng và tự hủy
    }
  }, [updateSessionMutation.isSuccess, onSuccess]);

  const handleSubmit = (values: any) => {
    const payload: UpdateSessionRequest = {
      id: session.id,
      name: values.name,
      content: values.content,
      positionOrder: values.positionOrder, // Đảm bảo là number
      courseId: values.courseId, // THÊM MỚI: Gửi courseId đã chọn lên server
      slug: "",
    };
    updateSessionMutation.mutate(payload);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Cập Nhập Buổi Học
      </h2>
      <Form.Item
        name="courseId"
        label="Thuộc khóa học"
        rules={[{ required: true, message: "Vui lòng chọn khóa học!" }]}
      >
        {courses?.length > 0 ? (
          <Select placeholder="-- Chọn khóa học --">
            {courses.map((course) => (
              <Select.Option key={course.id} value={course.id}>
                {course.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <div>Đang tải danh sách khóa học...</div>
        )}
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên phiên học"
        rules={[{ required: true, message: "Vui lòng nhập tên phiên học!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="content" label="Nội dung">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="positionOrder"
        label="Thứ tự"
        rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateSessionMutation.isPending}
          className="w-full bg-gradient-to-r from-[#20558A] to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateSessionForm;
