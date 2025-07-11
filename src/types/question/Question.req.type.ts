import { QuestionType } from "../../app/enums/questionType.enum";

export interface CreateQuestionRequest {
    surveyId: string;
    questionContent: string;
    questionType: QuestionType;
    positionOrder: number;
}

export interface UpdateQuestionRequest {
    questionContent: string;
    questionType: QuestionType;
    positionOrder: number;
}

export interface DeleteQuestionRequest {
    id: string;
}

export interface GetQuestionByIdRequest {
    id: string;
}

export interface SearchQuestionRequest {
    surveyId: string;
    pageNumber: number;
    pageSize: number;
    filter: string;
}


