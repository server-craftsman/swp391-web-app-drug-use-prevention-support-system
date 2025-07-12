import { useState } from 'react';
import AssessmentList from './AssessmentList.com';
import AssessmentQuiz from './AssessmentQuiz.com';
import AssessmentResult from './AssessmentResult.com';

type AssessmentView = 'list' | 'quiz' | 'result';

export default function AssessmentContainer() {
    const [currentView, setCurrentView] = useState<AssessmentView>('list');
    const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
    const [surveyResult, setSurveyResult] = useState<any>(null);

    const handleStartAssessment = (surveyId: string) => {
        setSelectedSurveyId(surveyId);
        setCurrentView('quiz');
    };

    const handleViewResult = (surveyId: string) => {
        // TODO: Fetch existing result for this survey
        console.log('Viewing result for survey:', surveyId);
    };

    const handleQuizComplete = (result: any) => {
        setSurveyResult(result);
        setCurrentView('result');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedSurveyId('');
        setSurveyResult(null);
    };

    const handleStartNewAssessment = () => {
        setCurrentView('list');
        setSelectedSurveyId('');
        setSurveyResult(null);
    };

    switch (currentView) {
        case 'quiz':
            return (
                <AssessmentQuiz
                    surveyId={selectedSurveyId}
                    onComplete={handleQuizComplete}
                    onBack={handleBackToList}
                />
            );

        case 'result':
            return (
                <AssessmentResult
                    surveyResult={surveyResult}
                    onBack={handleBackToList}
                    onStartNewAssessment={handleStartNewAssessment}
                />
            );

        default:
            return (
                <AssessmentList
                    onStartAssessment={handleStartAssessment}
                    onViewResult={handleViewResult}
                />
            );
    }
} 