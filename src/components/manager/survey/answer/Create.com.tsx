import React from "react";
import { Modal, Form, Input, InputNumber, Button, Card, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined, CheckCircleOutlined, FileTextOutlined, NumberOutlined, StarOutlined } from "@ant-design/icons";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { QuestionType } from "../../../../app/enums/questionType.enum";

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

    const getDisplayQuestionType = (questionType: QuestionType) => {
        switch (questionType) {
            case QuestionType.MULTIPLE_CHOICE:
                return "Trắc nghiệm";
            default:
                return "Câu hỏi khác";
        }
    }

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <PlusOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Tạo đáp án mới</h2>
                        <p className="text-sm text-gray-500">Thêm phương án trả lời cho câu hỏi</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={800}
            okText="Tạo đáp án"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="answer-create-modal"
            styles={{
                body: {
                    padding: '24px 32px'
                },
                content: {
                    borderRadius: '16px',
                    background: 'white'
                },
                header: {
                    background: 'white',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '24px 32px 0'
                }
            }}
        >
            {question && (
                <div className="space-y-6">

                    {/* Question Info */}
                    <Card className="border-0 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileTextOutlined className="text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 mb-2">Nội dung câu hỏi:</h4>
                                    <div
                                        className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg border border-gray-100"
                                        dangerouslySetInnerHTML={{ __html: question.questionContent }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Loại:</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {getDisplayQuestionType(question.questionType)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Thứ tự:</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        #{question.positionOrder}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Form form={form} layout="vertical" className="space-y-4">
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card
                                            key={key}
                                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <CheckCircleOutlined className="text-green-500" />
                                                    <span className="font-semibold text-gray-700">Phương án {name + 1}</span>
                                                </div>
                                            }
                                            extra={
                                                fields.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => remove(name)}
                                                        className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                                    >
                                                        Xóa
                                                    </Button>
                                                )
                                            }
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'optionContent']}
                                                label={
                                                    <span className="font-semibold text-gray-700">
                                                        <FileTextOutlined className="mr-2" />
                                                        Nội dung phương án
                                                    </span>
                                                }
                                                rules={[{ required: true, whitespace: true, message: 'Nhập nội dung phương án' }]}
                                            >
                                                <Input.TextArea
                                                    rows={3}
                                                    maxLength={500}
                                                    showCount
                                                    placeholder="Nhập nội dung phương án..."
                                                    className="rounded-lg border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                                                />
                                            </Form.Item>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'score']}
                                                    label={
                                                        <span className="font-semibold text-gray-700">
                                                            <StarOutlined className="mr-2" />
                                                            Điểm
                                                        </span>
                                                    }
                                                    rules={[{ required: true, type: 'number', message: 'Nhập điểm' }]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        max={1000}
                                                        placeholder="Điểm"
                                                        className="w-full h-11 rounded-lg border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                                                        size="large"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'positionOrder']}
                                                    label={
                                                        <span className="font-semibold text-gray-700">
                                                            <NumberOutlined className="mr-2" />
                                                            Thứ tự
                                                        </span>
                                                    }
                                                    rules={[{ required: true, type: 'number', min: 1, message: 'Thứ tự >= 1' }]}
                                                >
                                                    <InputNumber
                                                        min={1}
                                                        max={1000}
                                                        placeholder="Thứ tự"
                                                        className="w-full h-11 rounded-lg border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-200"
                                                        size="large"
                                                    />
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
                                            className="h-12 border-2 border-dashed border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200 rounded-lg"
                                            size="large"
                                        >
                                            Thêm phương án
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>

                    <Divider />

                    {/* Preview Section */}
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Xem trước</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Phương án sẽ được thêm vào câu hỏi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Có thể chỉnh sửa sau khi tạo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Đáp án sẽ sẵn sàng để sử dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AnswerCreateModal;
