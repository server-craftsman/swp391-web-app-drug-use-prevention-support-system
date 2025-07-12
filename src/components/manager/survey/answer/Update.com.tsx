import React from "react";
import { Modal, Form, Input, InputNumber, Button, Card, Popconfirm } from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";

interface Props {
    open: boolean;
    question: QuestionResponse | null;
    existingAnswers: AnswerResponse[];
    onClose: () => void;
    onSuccess: () => void;
}

const AnswerUpdateModal: React.FC<Props> = ({ open, question, existingAnswers, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        if (open && question && existingAnswers.length > 0) {
            // Map existing answers to form structure
            const options = existingAnswers.map((answer) => ({
                id: answer.id,
                optionContent: answer.optionContent,
                score: answer.score,
                positionOrder: answer.positionOrder,
            }));
            form.setFieldsValue({ options });
        } else if (!open) {
            form.resetFields();
        }
    }, [open, question, existingAnswers, form]);

    const handleDeleteAnswer = async (answerId: string, fieldName: number) => {
        if (!answerId) {
            // If it's a new option (no ID), just remove from form
            const options = form.getFieldValue('options') || [];
            const newOptions = options.filter((_: any, index: number) => index !== fieldName);
            form.setFieldValue('options', newOptions);
            return;
        }

        try {
            setDeletingIds(prev => new Set(prev).add(answerId));
            await AnswerService.deleteAnswer(answerId);

            // Remove from form
            const options = form.getFieldValue('options') || [];
            const newOptions = options.filter((_: any, index: number) => index !== fieldName);
            form.setFieldValue('options', newOptions);

            helpers.notificationMessage("Xóa đáp án thành công", "success");
        } catch (error) {
            helpers.notificationMessage("Có lỗi xảy ra khi xóa đáp án", "error");
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(answerId);
                return newSet;
            });
        }
    };

    const handleOk = async () => {
        if (!question) return;
        try {
            const values = await form.validateFields();
            const payload = {
                options: values.options.map((option: any) => ({
                    id: option.id || "", // For new options, this will be empty
                    optionContent: option.optionContent?.trim(),
                    score: option.score,
                    positionOrder: option.positionOrder,
                }))
            };
            setSubmitting(true);

            await AnswerService.updateAnswer({ ...payload });
            helpers.notificationMessage("Cập nhật đáp án thành công", "success");
            onSuccess();
            onClose();
        } catch (error) {
            helpers.notificationMessage("Có lỗi xảy ra khi cập nhật đáp án", "error");
        }
        finally { setSubmitting(false); }
    };

    return (
        <Modal
            title={
                <div>
                    Cập nhật đáp án cho câu hỏi: <span dangerouslySetInnerHTML={{ __html: question?.questionContent || "" }} />
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
                                {fields.map(({ key, name, ...restField }) => {
                                    const currentOption = form.getFieldValue(['options', name]);
                                    const isExistingAnswer = currentOption?.id;
                                    const isDeleting = isExistingAnswer && deletingIds.has(currentOption.id);

                                    return (
                                        <Card
                                            key={key}
                                            size="small"
                                            className="mb-3"
                                            title={
                                                <div className="flex justify-between items-center">
                                                    <span>Phương án {name + 1}</span>
                                                    {isExistingAnswer && (
                                                        <span className="text-xs text-gray-500">
                                                            ID: {currentOption.id}
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                            extra={
                                                <div className="flex gap-2">
                                                    {isExistingAnswer ? (
                                                        <Popconfirm
                                                            title="Xóa đáp án"
                                                            description="Bạn có chắc chắn muốn xóa đáp án này?"
                                                            onConfirm={() => handleDeleteAnswer(currentOption.id, name)}
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                            okButtonProps={{ danger: true }}
                                                        >
                                                            <Button
                                                                type="text"
                                                                danger
                                                                size="small"
                                                                icon={<DeleteOutlined />}
                                                                loading={isDeleting}
                                                                title="Xóa đáp án vĩnh viễn"
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </Popconfirm>
                                                    ) : (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<MinusCircleOutlined />}
                                                            onClick={() => remove(name)}
                                                            title="Loại bỏ khỏi form"
                                                        >
                                                            Loại bỏ
                                                        </Button>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'id']}
                                                hidden
                                            >
                                                <Input type="hidden" />
                                            </Form.Item>

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
                                    );
                                })}

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

export default AnswerUpdateModal;
