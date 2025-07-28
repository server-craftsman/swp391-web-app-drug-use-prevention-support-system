import React from "react";
import { Modal, Form, Input, InputNumber, Button, Card, Popconfirm, Avatar, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, FileTextOutlined, NumberOutlined, StarOutlined, SaveOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { AnswerService } from "../../../../services/answer/answer.service";
import { helpers } from "../../../../utils";
import type { AnswerResponse } from "../../../../types/answer/Answer.res.type";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import { QuestionType } from "../../../../app/enums/questionType.enum";

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
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                        <EditOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Cập nhật đáp án</h2>
                        <p className="text-sm text-gray-500">Chỉnh sửa phương án trả lời</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={800}
            okText="Lưu thay đổi"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-orange-500 hover:bg-orange-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large",
                icon: <SaveOutlined />
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="answer-update-modal"
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
                    {/* Question Preview Card */}
                    <Card className="border-0 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={48}
                                    style={{
                                        backgroundColor: '#f59e0b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}
                                >
                                    <EditOutlined />
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Chỉnh sửa đáp án</h3>
                                    <p className="text-sm text-gray-600">Cập nhật thông tin chi tiết</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-orange-600">{existingAnswers.length}</div>
                                <div className="text-sm text-gray-500">phương án</div>
                            </div>
                        </div>
                    </Card>

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
                                    {fields.map(({ key, name, ...restField }) => {
                                        const currentOption = form.getFieldValue(['options', name]);
                                        const isExistingAnswer = currentOption?.id;
                                        const isDeleting = isExistingAnswer && deletingIds.has(currentOption.id);

                                        return (
                                            <Card
                                                key={key}
                                                className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                                title={
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircleOutlined className="text-green-500" />
                                                            <span className="font-semibold text-gray-700">Phương án {name + 1}</span>
                                                        </div>
                                                        {isExistingAnswer && (
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                ID: {currentOption.id}
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                                extra={
                                                    <div className="flex gap-2">
                                                        {isExistingAnswer ? (
                                                            <Popconfirm
                                                                title={
                                                                    <div className="flex items-center gap-2">
                                                                        <ExclamationCircleOutlined className="text-red-500" />
                                                                        <span>Xóa đáp án</span>
                                                                    </div>
                                                                }
                                                                description="Bạn có chắc chắn muốn xóa đáp án này?"
                                                                onConfirm={() => handleDeleteAnswer(currentOption.id, name)}
                                                                okText="Xóa"
                                                                cancelText="Hủy"
                                                                okButtonProps={{
                                                                    danger: true,
                                                                    className: "bg-red-500 hover:bg-red-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                                                                    size: "large"
                                                                }}
                                                                cancelButtonProps={{
                                                                    className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                                                                    size: "large"
                                                                }}
                                                            >
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    icon={<DeleteOutlined />}
                                                                    loading={isDeleting}
                                                                    className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                                                    size="large"
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Popconfirm>
                                                        ) : (
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<MinusCircleOutlined />}
                                                                onClick={() => remove(name)}
                                                                className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                                                size="large"
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
                                                        className="rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-200"
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
                                                            className="w-full h-11 rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-200"
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
                                                            className="w-full h-11 rounded-lg border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-200"
                                                            size="large"
                                                        />
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
                                            className="h-12 border-2 border-dashed border-orange-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 rounded-lg"
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

                    {/* Changes Preview */}
                    <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Xem trước thay đổi</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                <span>Thông tin sẽ được cập nhật sau khi lưu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Các phương án sẽ được sắp xếp theo thứ tự</span>
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

export default AnswerUpdateModal;
