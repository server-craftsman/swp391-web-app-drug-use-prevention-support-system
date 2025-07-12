import type { QuestionType } from "../../app/enums/questionType.enum";

export interface AnswerOptionResponse {
    id: string;
    questionId: string | null;
    optionContent: string;
    score: number;
    positionOrder: number;
}

export interface QuestionResponse {
    id: string;
    surveyId?: string;
    questionContent: string;
    questionType: QuestionType;
    positionOrder: number;
    answerOptions?: AnswerOptionResponse[];
}
