import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess, ResponsePaged } from "../../app/interface";
import type {
    CreateQuestionRequest,
    SearchQuestionRequest,
    UpdateQuestionRequest,
} from "../../types/question/Question.req.type";
import type { QuestionResponse } from "../../types/question/Question.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const QuestionService = {
    /* Lấy tất cả câu hỏi phân trang */
    getAllQuestions(params: SearchQuestionRequest) {
        const url = API_PATH.QUESTION.GET_ALL_QUESTIONS;
        const payload = params;
        return BaseService.get<ResponsePaged<QuestionResponse[]>>({
            url,
            payload,
        });
    },

    /* Lấy chi tiết câu hỏi theo id */
    getQuestionById(id: string) {
        return BaseService.get<ResponseSuccess<QuestionResponse>>({
            url: API_PATH.QUESTION.GET_QUESTION_BY_ID(id),
        });
    },

    /* Lấy câu hỏi theo survey id */
    getQuestionBySurveyId(surveyId: string) {
        return BaseService.get<ResponseSuccess<QuestionResponse[]>>({
            url: API_PATH.QUESTION.GET_QUESTION_BY_SURVEY_ID(surveyId),
        });
    },

    /* Tạo câu hỏi */
    createQuestion(params: CreateQuestionRequest) {
        return BaseService.post<ResponseSuccess<QuestionResponse>>({
            url: API_PATH.QUESTION.CREATE_QUESTION,
            payload: params,
        });
    },

    /* Cập nhật câu hỏi */
    updateQuestion(id: string, params: UpdateQuestionRequest) {
        return BaseService.put<ResponseSuccess<QuestionResponse>>({
            url: API_PATH.QUESTION.UPDATE_QUESTION(id),
            payload: params,
        });
    },

    /* Xoá câu hỏi */
    deleteQuestion(id: string) {
        return BaseService.remove<ResponseSuccess<void>>({
            url: API_PATH.QUESTION.DELETE_QUESTION(id),
        });
    },
};





