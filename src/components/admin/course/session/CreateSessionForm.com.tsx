import { Form, Input, Button, message, Select } from "antd";
import { useCreateSession } from "../../../../hooks/useSession";
import type { CreateSessionRequest } from "../../../../types/session/Session.req.type";
import type { Course } from "../../../../types/course/Course.res.type";
import Editor from "../../../common/Editor.com";

interface CreateSessionFormProps {
  courses: Course[];
  onSuccess: () => void;
}

const CreateSessionForm = ({ courses, onSuccess }: CreateSessionFormProps) => {
  const [form] = Form.useForm();
  const createSessionMutation = useCreateSession();

  const onFinish = (values: any) => {
    const storedUser = localStorage.getItem("userInfo");
    let userId = "";

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userId = user.id || "";
      } catch (e) {
        console.error("Lỗi khi parse dữ liệu user từ localStorage:", e);
      }
    }

    const payload: CreateSessionRequest = {
      courseId: values.courseId,
      name: values.name,
      userId,
      slug: "",
      content: values.content,
      positionOrder: values.positionOrder,
    };

    createSessionMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Tạo phiên học thành công");
        form.resetFields();
        onSuccess();
      },
      onError: (error: any) => {
        message.error("Tạo phiên học thất bại: " + error.message);
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo Phiên Học Mới
      </h2>
      <Form.Item
        label="Khóa học"
        name="courseId"
        rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
      >
        <Select placeholder="Chọn khóa học">
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên Phiên Học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên phiên học" }]}
      >
        <Input placeholder="Nhập tên phiên học" />
      </Form.Item>

      <Form.Item
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
      >
        <Editor />
      </Form.Item>

      <Form.Item
        label="Thứ tự"
        name="positionOrder"
        rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
      >
        <Input placeholder="Nhập thứ tự" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={createSessionMutation.isPending}
          block
          className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Tạo phiên học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateSessionForm;
