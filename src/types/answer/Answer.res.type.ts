export interface AnswerResponse {
    id: string;
    questionId: string;
    optionContent: string;
    score: number;
    positionOrder: number;
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
}

export interface PagedAnswerResponse {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}