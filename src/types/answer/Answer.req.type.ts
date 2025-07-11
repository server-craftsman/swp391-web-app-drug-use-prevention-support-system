export interface CreateAnswerRequest {
    questionId: string;
    options: {
        optionContent: string;
        score: number;
        positionOrder: number;
    }[];
}

export interface UpdateAnswerRequest {
    options: {
        id: string;
        optionContent: string;
        score: number;
        positionOrder: number;
    }[];
}

export interface DeleteAnswerRequest {
    id: string;
}

export interface SearchAnswerRequest {
    questionId: string;
    pageNumber: number;
    pageSize: number;
    filter: string;
    filterByScore: number;
}







