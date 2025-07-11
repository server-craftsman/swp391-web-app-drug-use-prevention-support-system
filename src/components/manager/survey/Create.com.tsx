import React from "react";
import { Modal, Form, Input, Select, Tag } from "antd";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { SurveyService } from "../../../services/survey/survey.service";
import { helpers, color } from "../../../utils";
import Editor from "../../common/Editor.com";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}


const SurveyCreateModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = async () => {
        let payload: any = null;

        try {
            const values = await form.validateFields();

            payload = {
                name: values.name?.trim() || "",
                description: values.description || "",
                surveyType: values.surveyType || SurveyType.RISK_ASSESSMENT
            };

            if (!payload.name) {
                helpers.notificationMessage("Tên khảo sát không được để trống", "error");
                return;
            }

            setIsSubmitting(true);

            await SurveyService.createSurvey(payload);

            helpers.notificationMessage("Tạo khảo sát thành công", "success");
            onSuccess();
            onClose();
            form.resetFields();
        } catch (error: any) {
            let errorMessage = "Có lỗi xảy ra khi tạo khảo sát";

            if (error?.response?.status === 500) {
                errorMessage = "Lỗi server 500. Có thể do định dạng dữ liệu không đúng.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Dữ liệu không hợp lệ (400)";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Tạo khảo sát"
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
                height: 'calc(100vh - 110px)', // adjust for modal header + footer
                overflowY: 'auto',
                padding: '24px'
            }}
            maskStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                    <Editor placeholder="Nhập mô tả khảo sát..." height={300} />
                </Form.Item>
                <Form.Item name="surveyType" label="Loại" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                    <Select placeholder="Chọn loại" optionLabelProp="label">
                        {Object.values(SurveyType).map((t) => (
                            <Select.Option
                                key={t}
                                value={t}
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                            {t}
                                        </Tag>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                        {t}
                                    </Tag>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SurveyCreateModal;
