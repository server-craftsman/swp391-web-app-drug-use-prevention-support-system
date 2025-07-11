import React from "react";
import { Modal, Form, Select, InputNumber } from "antd";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { QuestionService } from "../../../../services/question/question.service";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import { helpers } from "../../../../utils";
import Editor from "../../../common/Editor.com";

interface Props {
    open: boolean;
    surveys: SurveyResponse[];
    onClose: () => void;
    onSuccess: () => void;
}

const QuestionCreateModal: React.FC<Props> = ({ open, surveys, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                surveyId: values.surveyId,
                questionContent: values.questionContent?.trim(),
                questionType: values.questionType || QuestionType.MULTIPLE_CHOICE,
                positionOrder: values.positionOrder || 1,
            };

            if (!payload.surveyId) {
                helpers.notificationMessage("Vui lòng chọn khảo sát", "error");
                return;
            }

            if (!payload.questionContent) {
                helpers.notificationMessage("Nội dung câu hỏi không được để trống", "error");
                return;
            }

            setIsSubmitting(true);
            await QuestionService.createQuestion(payload);

            helpers.notificationMessage("Tạo câu hỏi thành công", "success");
            onSuccess();
            onClose();
            form.resetFields();
        } catch (error: any) {
            console.error("Error creating question:", error);
            let errorMessage = "Có lỗi xảy ra khi tạo câu hỏi";

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Tạo câu hỏi"
            open={open}
            onOk={handleOk}
            confirmLoading={isSubmitting}
            onCancel={onClose}
            destroyOnClose
            width={600}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                margin: 0,
                height: '100vh',
                maxWidth: '600px'
            }}
            bodyStyle={{
                height: 'calc(100vh - 110px)',
                overflowY: 'auto',
                padding: '24px'
            }}
            maskStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="surveyId"
                    label="Khảo sát"
                    rules={[{ required: true, message: 'Vui lòng chọn khảo sát' }]}
                >
                    <Select placeholder="Chọn khảo sát" allowClear>
                        {surveys.map((survey) => (
                            <Select.Option key={survey.id} value={survey.id}>
                                {survey.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                >
                    <Editor
                        placeholder="Nhập nội dung câu hỏi..."
                        height={200}
                        onChange={(content) => {
                            form.setFieldsValue({ questionContent: content });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="questionType"
                    label="Loại câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
                    initialValue={QuestionType.MULTIPLE_CHOICE}
                >
                    <Select placeholder="Chọn loại câu hỏi">
                        {Object.values(QuestionType).map((type) => (
                            <Select.Option key={type} value={type}>
                                {type === QuestionType.MULTIPLE_CHOICE ? "Trắc nghiệm" : type}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="positionOrder"
                    label="Thứ tự"
                    rules={[{ required: true, type: "number", min: 1, message: 'Vui lòng nhập thứ tự hợp lệ' }]}
                    initialValue={1}
                >
                    <InputNumber
                        min={1}
                        max={1000}
                        placeholder="Nhập thứ tự câu hỏi"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuestionCreateModal;
