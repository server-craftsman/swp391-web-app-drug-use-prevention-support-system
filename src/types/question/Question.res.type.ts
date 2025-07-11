import type { QuestionType } from "../../app/enums/questionType.enum";

export interface QuestionResponse {
    id: string;
    surveyId: string;
    questionContent: string;
    questionType: QuestionType;
    positionOrder: number;
}
