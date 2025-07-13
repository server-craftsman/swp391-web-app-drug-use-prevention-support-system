import { SurveyType } from "../../app/enums/surveyType.enum";
export interface SearchSurveyRequest {
    pageNumber: number;
    pageSize: number;
    filterByName: string;
}

export interface CreateSurveyRequest {
    name: string;
    description: string;
    surveyType: SurveyType;
    estimateTime: number;
}

export interface UpdateSurveyRequest {
    name: string;
    description: string;
    surveyType: SurveyType;
    estimateTime: number;
}

export interface DeleteSurveyRequest {
    id: string;
}

export interface GetSurveyByIdRequest {
    id: string;
}

export interface SubmitSurveyRequest {
    userId: string;
    surveyId: string;
    answers: {
        questionId: string;
        answerOptionId: string;
    }[];
}

