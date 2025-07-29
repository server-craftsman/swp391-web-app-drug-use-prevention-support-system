import { useState, useEffect } from 'react';
import {
    LeftOutlined,
    RightOutlined,
    CheckOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { SurveyService } from '../../../services/survey/survey.service';
import { useAuth } from '../../../contexts/Auth.context';
import type { SurveyResponse } from '../../../types/survey/Survey.res.type';
import type { QuestionResponse } from '../../../types/question/Question.res.type';
import type { SubmitSurveyRequest } from '../../../types/survey/Survey.req.type';

interface AssessmentQuizProps {
    surveyId: string;
    onComplete?: (result: any) => void;
    onBack?: () => void;
}

export default function AssessmentQuiz({ surveyId, onComplete, onBack }: AssessmentQuizProps) {
    const [survey, setSurvey] = useState<SurveyResponse | null>(null);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userInfo } = useAuth();

    useEffect(() => {
        if (surveyId) {
            fetchSurveyData();
        } else {
            setError('Không có ID bài khảo sát');
            setLoading(false);
        }
    }, [surveyId]);

    const fetchSurveyData = async () => {
        try {
            setLoading(true);
            setError(null);
            const surveyResponse = await SurveyService.getSurveyById(surveyId);
            let surveyData: SurveyResponse | null = null;

            // Handle different possible response structures
            if (surveyResponse.data?.data) {
                surveyData = surveyResponse.data.data;
            } else if (surveyResponse.data) {
                surveyData = surveyResponse.data as unknown as SurveyResponse;
            } else {
                setError('Không thể tải thông tin bài khảo sát');
                return;
            }

            if (surveyData) {
                setSurvey(surveyData);

                if (surveyData.questions && surveyData.questions.length > 0) {
                    const sortedQuestions = surveyData.questions.sort((a, b) => a.positionOrder - b.positionOrder);
                    setQuestions(sortedQuestions);
                } else {
                    setError('Không tìm thấy câu hỏi cho bài khảo sát này');
                }
            } else {
                setError('Không thể tải thông tin bài khảo sát');
            }
        } catch (error) {
            setError('Không thể tải dữ liệu bài khảo sát. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError(null);

            // Check if user is authenticated
            if (!userInfo?.id) {
                setError('Vui lòng đăng nhập để hoàn thành bài khảo sát');
                return;
            }


            const submitData: SubmitSurveyRequest = {
                userId: userInfo.id,
                surveyId: surveyId,
                answers: Object.entries(answers).map(([questionId, answerOptionId]) => ({
                    questionId,
                    answerOptionId
                }))
            };

            // Try sending data directly without model wrapper
            const response = await SurveyService.submitSurvey(submitData);

            if (response.data?.data && onComplete) {
                onComplete(response.data.data);
            } else if (response.data && onComplete) {
                // Handle case where response.data is the direct result
                onComplete(response.data);
            }
        } catch (error: any) {
            // Handle specific API errors
            if (error.response?.status === 400) {
                const errorData = error.response.data;

                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat();
                    setError(`Lỗi dữ liệu: ${errorMessages.join(', ')}`);
                } else {
                    setError('Dữ liệu gửi không hợp lệ. Vui lòng thử lại.');
                }
            } else {
                setError('Có lỗi xảy ra khi gửi bài khảo sát. Vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Lấy câu hỏi hiện tại dựa trên chỉ số câu hỏi hiện tại
    const currentQuestion = questions[currentQuestionIndex];

    // Tính toán phần trăm tiến độ hoàn thành bài khảo sát
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Kiểm tra xem có phải câu hỏi cuối cùng không
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // Kiểm tra xem người dùng có thể tiếp tục không (đã trả lời câu hỏi hiện tại)
    const canProceed = currentQuestion && answers[currentQuestion.id];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingOutlined className="text-4xl text-blue-600 mb-4" />
                    <p className="text-lg text-gray-600">Đang tải bài khảo sát...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchSurveyData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!survey || !currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">Không tìm thấy bài khảo sát</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onBack}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LeftOutlined className="mr-2" />
                            Quay lại
                        </button>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-gray-900">{survey.name}</h2>
                            <p className="text-gray-600">Câu hỏi {currentQuestionIndex + 1} / {questions.length}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                            className="bg-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            <span dangerouslySetInnerHTML={{ __html: currentQuestion.questionContent }} />
                        </h3>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {currentQuestion.answerOptions
                            ?.sort((a, b) => a.positionOrder - b.positionOrder)
                            .map((answer) => (
                                <button
                                    key={answer.id}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${answers[currentQuestion.id] === answer.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${answers[currentQuestion.id] === answer.id
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                            }`}>
                                            {answers[currentQuestion.id] === answer.id && (
                                                <CheckOutlined className="text-white text-xs" />
                                            )}
                                        </div>
                                        <span className="font-medium">{answer.optionContent}</span>
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${currentQuestionIndex === 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <LeftOutlined className="mr-2" />
                        Câu trước
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!canProceed || submitting}
                            className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${!canProceed || submitting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                        >
                            {submitting ? (
                                <>
                                    <LoadingOutlined className="mr-2" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    Hoàn thành
                                    <CheckOutlined className="ml-2" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${!canProceed
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                        >
                            Câu tiếp
                            <RightOutlined className="ml-2" />
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <ExclamationCircleOutlined className="text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 