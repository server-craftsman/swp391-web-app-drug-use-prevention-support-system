import React from "react";
import { Card, Typography, Tag, Form, Radio, Progress } from "antd";
import { SurveyType } from "../../../app/enums/surveyType.enum";

const { Title } = Typography;

interface SurveySectionProps {
    selectedSurvey: any | null;
    questions: any[];
    answersMap: Record<string, any[]>;
    activeSurveyType: SurveyType;
    form: any;
    onFormChange: (changed: any, all: any) => void;
    currentSurveysCount: number;
    answeredIds: Set<string>;
}

const SurveySection: React.FC<SurveySectionProps> = ({
    selectedSurvey,
    questions,
    answersMap,
    activeSurveyType,
    form,
    onFormChange,
    currentSurveysCount,
    answeredIds
}) => {
    const progress = questions.length ? Math.round(answeredIds.size / questions.length * 100) : 0;

    if (selectedSurvey && questions.length > 0) {
        return (
            <Card
                style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#ffffff'
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <Title level={3} style={{ color: '#2d3748', marginBottom: '8px' }}>
                        {selectedSurvey.name}
                    </Title>
                    <Tag
                        color={activeSurveyType === SurveyType.PRE_FEEDBACK ? 'green' : 'purple'}
                        style={{ fontSize: '13px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
                    >
                        {activeSurveyType === SurveyType.PRE_FEEDBACK ? (
                            <div className="flex items-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="ml-4">Khảo sát trước chương trình</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
                                </svg>
                                <span className="ml-4">Khảo sát sau chương trình</span>
                            </div>
                        )}
                    </Tag>

                    {/* Progress */}
                    {questions.length > 0 && (
                        <div style={{ marginTop: '16px', maxWidth: 300 }}>
                            <Progress percent={progress} size="small" strokeColor={{ '0%': '#52c41a', '100%': '#1890ff' }} />
                            <p style={{ fontSize: '12px', color: '#a0aec0', margin: 0 }}>{answeredIds.size}/{questions.length} câu hỏi · {progress}%</p>
                        </div>
                    )}
                </div>

                <Form form={form} layout="vertical" onValuesChange={onFormChange}>
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            id={`q-${question.id}`}
                            style={{
                                marginBottom: '32px',
                                paddingBottom: '16px',
                                borderBottom: '1px solid #e2e8f0'
                            }}
                        >
                            <Form.Item
                                label={
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <span style={{
                                            flexShrink: 0,
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: '#e6f7ff',
                                            color: '#1890ff',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            fontWeight: 500
                                        }}>
                                            {index + 1}
                                        </span>
                                        <span
                                            style={{ fontSize: '16px', fontWeight: 500, color: '#2d3748' }}
                                            dangerouslySetInnerHTML={{ __html: (question.questionText ?? question.questionContent ?? '') }}
                                        />
                                    </div>
                                }
                                name={question.id}
                                rules={[{ required: true, message: "Vui lòng chọn một câu trả lời" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Radio.Group style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {answersMap[question.id]?.map((answerOption: any) => (
                                        <Radio
                                            key={answerOption.id}
                                            value={answerOption.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            <span style={{ color: 'black' }}>
                                                {answerOption.optionContent || answerOption.answerText || answerOption.answerContent || answerOption.text || answerOption.content || 'Không có nội dung'}
                                            </span>
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    ))}
                </Form>
            </Card>
        );
    }

    // No surveys message
    return (
        <Card style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            textAlign: 'center',
            padding: '48px 24px'
        }}>
            <div style={{ color: '#a0aec0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                {currentSurveysCount === 0 ? (
                    <div>
                        <Title level={4} style={{ color: '#718096', marginBottom: '8px' }}>
                            Chưa có khảo sát {activeSurveyType === SurveyType.PRE_FEEDBACK ? 'trước' : 'sau'} chương trình
                        </Title>
                        <p style={{ color: '#a0aec0', margin: 0 }}>
                            Khảo sát đang được chuẩn bị. Vui lòng quay lại sau.
                        </p>
                    </div>
                ) : (
                    <div>
                        <Title level={4} style={{ color: '#718096', marginBottom: '8px' }}>
                            Khảo sát đang được cập nhật
                        </Title>
                        <p style={{ color: '#a0aec0', margin: 0 }}>
                            Các câu hỏi khảo sát sẽ sớm có sẵn.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default SurveySection; 