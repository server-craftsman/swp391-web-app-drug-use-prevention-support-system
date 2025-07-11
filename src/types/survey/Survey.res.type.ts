import { SurveyType } from "../../app/enums/surveyType.enum";
import type { QuestionResponse } from "../question/Question.res.type";

export interface SurveyResponse {
    id: string;
    name: string;
    description: string;
    surveyType?: SurveyType;
    type?: SurveyType;
    createdAt?: string;
    questions?: QuestionResponse[];
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

