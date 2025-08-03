import React, { useEffect, useState } from "react";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import SurveyDetailDrawer from "../../../components/manager/survey/Detail.com";
import type { QuestionResponse } from "../../../types/question/Question.res.type";
import SurveyListComp from "../../../components/manager/survey/SurveyList.com";
import QuestionList from "../../../components/manager/survey/question/List.com";
import AnswerList from "../../../components/manager/survey/answer/List.com";

const SurveyPageManagement: React.FC = () => {
    // Active tab state
    const [activeTab, setActiveTab] = useState("survey");

    // fetch surveys for dropdowns
    const [allSurveys, setAllSurveys] = useState<SurveyResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);

    const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);

    // Refs to force refresh child components
    const [surveyRefreshKey, setSurveyRefreshKey] = useState(0);
    const [questionRefreshKey, setQuestionRefreshKey] = useState(0);
    const [answerRefreshKey, setAnswerRefreshKey] = useState(0);

    // Handle tab change - force refresh data for each tab
    const handleTabChange = (key: string) => {
        setActiveTab(key);

        // Force component remount by updating refresh key
        switch (key) {
            case 'survey':
                setSurveyRefreshKey(prev => prev + 1);
                break;
            case 'question':
                setQuestionRefreshKey(prev => prev + 1);
                break;
            case 'answer':
                setAnswerRefreshKey(prev => prev + 1);
                break;
        }
    };

    // Initial load on first mount
    useEffect(() => {
        if (activeTab === 'survey') {
            setSurveyRefreshKey(prev => prev + 1);
        }
    }, []);

    const tabData = [
        {
            key: "survey",
            label: "Bảng khảo sát",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            ),
            component: (
                <SurveyListComp
                    key={surveyRefreshKey}
                    onSelectSurvey={setSelectedSurvey}
                    onLoadedSurveys={setAllSurveys}
                />
            )
        },
        {
            key: "question",
            label: "Bảng câu hỏi",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
            ),
            component: (
                <QuestionList
                    key={questionRefreshKey}
                    surveys={allSurveys}
                    onLoadedQuestions={setQuestions}
                />
            )
        },
        {
            key: "answer",
            label: "Bảng câu trả lời",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ),
            component: (
                <AnswerList
                    key={answerRefreshKey}
                    questions={questions}
                    pageSizeDefault={10}
                />
            )
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Quản lý Khảo sát
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Quản lý toàn bộ khảo sát, câu hỏi và câu trả lời</p>
                        </div>
                    </div>
                </div>

                {/* Custom Tab Navigation */}
                <div className="bg-white rounded-2xl  overflow-hidden">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex">
                            {tabData.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`
                                        relative flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all duration-300 ease-out
                                        ${activeTab === tab.key
                                            ? 'text-blue-700 bg-white shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        transition-all duration-300
                                        ${activeTab === tab.key ? 'text-blue-600 scale-110' : 'text-gray-400'}
                                    `}>
                                        {tab.icon}
                                    </div>
                                    <span className="relative">
                                        {tab.label}
                                        {activeTab === tab.key && (
                                            <div className="absolute -bottom-5 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 min-h-[600px]">
                        <div className="animate-fadeIn">
                            {tabData.find(tab => tab.key === activeTab)?.component}
                        </div>
                    </div>
                </div>

                {/* Drawer for survey detail (only from survey tab) */}
                <SurveyDetailDrawer
                    open={!!selectedSurvey}
                    onClose={() => setSelectedSurvey(null)}
                    surveyId={selectedSurvey?.id}
                    surveyName={selectedSurvey?.name}
                    surveyType={selectedSurvey?.surveyType}
                    surveyDescription={selectedSurvey?.description}
                    estimateTime={selectedSurvey?.estimateTime ?? undefined}
                />
            </div>

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .border-b-3 {
                    border-bottom-width: 3px;
                }
            `}</style>
        </div>
    );
};

export default SurveyPageManagement;
