import { SurveyType } from "../../app/enums/surveyType.enum";

export interface SurveyResponse {
    id: string;
    name: string;
    description: string;
    surveyType: SurveyType;
}

export interface SurveySubmissionResponse {
    id: string;
    userId: string;
    surveyId: string;
    answers: {
        questionId: string;
        answerOptionId: string;
    }[];
}

