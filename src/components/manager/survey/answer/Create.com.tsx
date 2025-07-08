import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";

interface Props {
    open: boolean;
    questions: QuestionResponse[];
    defaultQuestionId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AnswerCreateModal: React.FC<Props> = ({ open, questions, defaultQuestionId, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open) form.resetFields();
    }, [open]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                questionId: values.questionId,
                optionContent: values.optionContent?.trim(),
                score: values.score,
                positionOrder: values.positionOrder,
            };
            setSubmitting(true);
            await AnswerService.createAnswer(payload as any);
            helpers.notificationMessage("Tạo đáp án thành công", "success");
            onSuccess();
            onClose();
        } catch { }
        finally { setSubmitting(false); }
    };

    return (
        <Modal
            title="Tạo đáp án"
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={500}
            style={{ position: 'absolute', right: 0, top: 0, margin: 0, height: '100vh', maxWidth: '500px' }}
            bodyStyle={{ height: 'calc(100vh - 110px)', overflowY: 'auto', padding: '24px' }}
            maskStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
            <Form form={form} layout="vertical" initialValues={{ questionId: defaultQuestionId }}>
                <Form.Item name="questionId" label="Câu hỏi" rules={[{ required: true, message: 'Chọn câu hỏi' }]}>
                    <Select showSearch optionFilterProp="children" placeholder="Chọn câu hỏi">
                        {questions.map(q => (
                            <Select.Option key={q.id} value={q.id}>{q.questionContent}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="optionContent" label="Phương án" rules={[{ required: true, whitespace: true, message: 'Nhập phương án' }]}>
                    <Input.TextArea rows={3} maxLength={500} showCount />
                </Form.Item>
                <Form.Item name="score" label="Điểm" rules={[{ required: true, type: 'number', message: 'Nhập điểm' }]} initialValue={0}>
                    <InputNumber min={0} max={1000} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="positionOrder" label="Thứ tự" rules={[{ required: true, type: 'number', min: 1, message: 'Thứ tự >=1' }]} initialValue={1}>
                    <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AnswerCreateModal;
