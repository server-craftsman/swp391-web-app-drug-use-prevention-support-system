import { Form, Input, Button, message } from "antd";
import { useCreateSession } from "../../../hooks/useSession";
import type { CreateSessionRequest } from "../../../types/session/Session.req.type";

interface CreateSessionFormProps {
  courseId: string; // Bắt buộc truyền vào
  onSuccess: () => void;
}

const CreateSessionForm = ({ courseId, onSuccess }: CreateSessionFormProps) => {
  const [form] = Form.useForm();
  const createSessionMutation = useCreateSession();

  const onFinish = (values: any) => {
    const storedUser = localStorage.getItem("userInfo");
    let userId = "";

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userId = user.id || ""; // lấy id từ localStorage
      } catch (e) {
        console.error("Lỗi khi parse dữ liệu user từ localStorage:", e);
      }
    }

    const payload: CreateSessionRequest = {
      courseId,
      name: values.name,
      userId, // gán userId đã lấy được
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
      <Form.Item
        label="Tên phiên học"
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
        <Input.TextArea rows={4} placeholder="Nhập nội dung phiên học" />
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
        >
          Tạo phiên học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateSessionForm;
