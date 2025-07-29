import {
    ClockCircleOutlined,
    FileTextOutlined,
    RightOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import type { SurveyResponse } from '../../../types/survey/Survey.res.type';

interface SurveyWithQuestionCount extends SurveyResponse {
    questionCount: number;
}

interface AssessmentCardProps {
    survey: SurveyWithQuestionCount;
    categoryInfo: {
        label: string;
        color: string;
        icon: any;
    };
    difficultyInfo: {
        label: string;
        color: string;
    };
    CategoryIcon: any;
    onStartAssessment: (surveyId: string) => void;
    onViewResult: (surveyId: string) => void;
}

export default function AssessmentCard({
    survey,
    categoryInfo,
    difficultyInfo,
    CategoryIcon,
    onStartAssessment,
    onViewResult
}: AssessmentCardProps) {
    const getDuration = (questionsCount: number) => {
        if (questionsCount <= 5) return '5-10 phút';
        if (questionsCount <= 10) return '10-15 phút';
        return '15-20 phút';
    };

    const handleStartAssessment = (surveyId: string) => {
        console.log('Starting assessment for survey:', surveyId);
        onStartAssessment(surveyId);
    };

    const handleViewResult = (surveyId: string) => {
        console.log('Viewing result for survey:', surveyId);
        onViewResult(surveyId);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {survey.name || 'Không có tên'}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            <span dangerouslySetInnerHTML={{ __html: survey.description || 'Không có mô tả' }} />
                        </p>
                        {/* Debug info */}
                        {/* <div className="text-xs text-gray-400 mt-2">
                            ID: {survey.id} | Type: {survey.surveyType} | Questions: {survey.questionCount}
                        </div> */}
                    </div>
                    {survey.isCompleted && (
                        <CheckCircleOutlined className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {categoryInfo.label}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyInfo.color}`}>
                        {difficultyInfo.label}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <ClockCircleOutlined className="h-4 w-4 mr-1" />
                        {getDuration(survey.questionCount)}
                    </div>
                    <div className="flex items-center">
                        <FileTextOutlined className="h-4 w-4 mr-1" />
                        {survey.questionCount} câu hỏi
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50">
                {survey.isCompleted ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Trạng thái:</span>
                            <span className="text-lg font-semibold text-green-600">
                                Đã hoàn thành
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleViewResult(survey.id)}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                                Xem kết quả
                            </button>
                            <button
                                onClick={() => handleStartAssessment(survey.id)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                            >
                                Làm lại
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => handleStartAssessment(survey.id)}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-200 text-sm font-medium flex items-center justify-center group"
                    >
                        Bắt đầu khảo sát
                        <RightOutlined className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                )}
            </div>
        </div>
    );
} 