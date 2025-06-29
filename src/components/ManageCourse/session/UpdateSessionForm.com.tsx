import { Form, Input, Button } from "antd";
import { useEffect } from "react";
import type { Session } from "../../../types/session/Session.res.type";
import { useUpdateSession } from "../../../hooks/useSession";
import type { UpdateSessionRequest } from "../../../types/session/Session.req.type";

interface UpdateSessionFormProps {
  session: Session;
  onSuccess: () => void;
}

const UpdateSessionForm = ({ session, onSuccess }: UpdateSessionFormProps) => {
  const [form] = Form.useForm();
  const updateSessionMutation = useUpdateSession();

  useEffect(() => {
    form.setFieldsValue({
      name: session.name,
      content: session.content,
      positionOrder: session.positionOrder,
    });
  }, [session]);

  useEffect(() => {
    if (updateSessionMutation.isSuccess) {
      form.resetFields();
      onSuccess();
    }
  }, [updateSessionMutation.isSuccess]);

  const handleSubmit = (values: any) => {
    const payload: UpdateSessionRequest = {
      id: session.id,
      name: values.name,
      content: values.content,
      positionOrder: values.positionOrder,
      slug: "", // vẫn gửi slug rỗng nếu API yêu cầu, nếu không thì có thể bỏ luôn trường này khỏi payload
    };
    updateSessionMutation.mutate(payload);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item name="name" label="Tên phiên học" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="Nội dung">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="positionOrder"
        label="Thứ tự"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateSessionMutation.isPending}
        >
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateSessionForm;
