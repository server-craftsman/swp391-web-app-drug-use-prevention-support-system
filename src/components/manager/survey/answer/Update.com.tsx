import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";

interface Props {
    open: boolean;
    initialData: AnswerResponse | null;
    questions: QuestionResponse[];
    onClose: () => void;
    onSuccess: () => void;
}

const AnswerUpdateModal: React.FC<Props> = ({ open, initialData, questions, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({
                optionContent: initialData.optionContent,
                score: initialData.score,
                positionOrder: initialData.positionOrder,
            });
        } else if (!open) {
            form.resetFields();
        }
    }, [open, initialData]);

    const handleOk = async () => {
        if (!initialData) return;
        try {
            const values = await form.validateFields();
            const payload = {
                optionContent: values.optionContent?.trim(),
                score: values.score,
                positionOrder: values.positionOrder,
            };
            setSubmitting(true);
            await AnswerService.updateAnswer(initialData.id, payload as any);
            helpers.notificationMessage("Cập nhật đáp án thành công", "success");
            onSuccess();
            onClose();
        } catch { }
        finally { setSubmitting(false); }
    };

    return (
        <Modal
            title="Cập nhật đáp án"
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
            {initialData && (
                <Form form={form} layout="vertical">
                    <Form.Item name="questionId" label="Câu hỏi">
                        <Select value={initialData.questionId} disabled>
                            {questions.map(q => (
                                <Select.Option key={q.id} value={q.id}>{q.questionContent}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="optionContent" label="Phương án" rules={[{ required: true, whitespace: true }]}> <Input.TextArea rows={3} maxLength={500} showCount /> </Form.Item>
                    <Form.Item name="score" label="Điểm" rules={[{ required: true, type: 'number' }]}><InputNumber min={0} max={1000} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="positionOrder" label="Thứ tự" rules={[{ required: true, type: 'number', min: 1 }]}><InputNumber min={1} max={1000} style={{ width: '100%' }} /></Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AnswerUpdateModal;
