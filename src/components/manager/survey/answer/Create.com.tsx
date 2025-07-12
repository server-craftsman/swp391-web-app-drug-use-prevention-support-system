import React from "react";
import { Modal, Form, Input, InputNumber, Button, Card } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";

interface Props {
    open: boolean;
    question: QuestionResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

const AnswerCreateModal: React.FC<Props> = ({ open, question, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            form.resetFields();
            // Set initial options with default values
            form.setFieldsValue({
                options: [
                    { optionContent: "", score: 0, positionOrder: 1 }
                ]
            });
        }
    }, [open, form]);

    const handleOk = async () => {
        if (!question) return;
        try {
            const values = await form.validateFields();
            const payload = {
                questionId: question.id,
                options: values.options.map((option: any) => ({
                    optionContent: option.optionContent?.trim(),
                    score: option.score,
                    positionOrder: option.positionOrder,
                }))
            };
            setSubmitting(true);
            await AnswerService.createAnswer(payload);
            helpers.notificationMessage("Tạo đáp án thành công", "success");
            onSuccess();
            onClose();
        } catch (error) {
            helpers.notificationMessage("Có lỗi xảy ra khi tạo đáp án", "error");
        }
        finally { setSubmitting(false); }
    };

    return (
        <Modal
            title={
                <div>
                    Tạo đáp án cho câu hỏi: <span dangerouslySetInnerHTML={{ __html: question?.questionContent || "" }} />
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={700}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            {question && (
                <Form form={form} layout="vertical">
                    <Card size="small" className="mb-4" style={{ backgroundColor: '#f0f2f5' }}>
                        <div><strong>Câu hỏi:</strong> <span dangerouslySetInnerHTML={{ __html: question.questionContent }} /></div>
                        <div><strong>Loại:</strong> {question.questionType}</div>
                    </Card>

                    <Form.List name="options">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        className="mb-3"
                                        title={`Phương án ${name + 1}`}
                                        extra={
                                            fields.length > 1 && (
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => remove(name)}
                                                >
                                                    Xóa
                                                </Button>
                                            )
                                        }
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'optionContent']}
                                            label="Nội dung phương án"
                                            rules={[{ required: true, whitespace: true, message: 'Nhập nội dung phương án' }]}
                                        >
                                            <Input.TextArea rows={2} maxLength={500} showCount placeholder="Nhập nội dung phương án..." />
                                        </Form.Item>

                                        <div className="flex gap-4">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'score']}
                                                label="Điểm"
                                                rules={[{ required: true, type: 'number', message: 'Nhập điểm' }]}
                                                className="flex-1"
                                            >
                                                <InputNumber min={0} max={1000} style={{ width: '100%' }} placeholder="Điểm" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'positionOrder']}
                                                label="Thứ tự"
                                                rules={[{ required: true, type: 'number', min: 1, message: 'Thứ tự >= 1' }]}
                                                className="flex-1"
                                            >
                                                <InputNumber min={1} max={1000} style={{ width: '100%' }} placeholder="Thứ tự" />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add({ optionContent: "", score: 0, positionOrder: fields.length + 1 })}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm phương án
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            )}
        </Modal>
    );
};

export default AnswerCreateModal;
