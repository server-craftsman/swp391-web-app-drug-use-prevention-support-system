import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess, ResponsePaged } from "../../app/interface";
import type {
    CreateAnswerRequest,
    SearchAnswerRequest,
    UpdateAnswerRequest,
} from "../../types/answer/Answer.req.type";
import type { AnswerResponse } from "../../types/answer/Answer.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const AnswerService = {
    /* Lấy tất cả answer phân trang */
    getAllAnswers(params: SearchAnswerRequest) {
        const url = API_PATH.ANSWER.GET_ALL_ANSWERS;
        const payload = params;
        return BaseService.get<ResponsePaged<AnswerResponse[]>>({
            url,
            payload,
        });
    },

    /* Lấy answer theo question id */
    getAnswerByQuestionId(questionId: string) {
        return BaseService.get<ResponseSuccess<AnswerResponse[]>>({
            url: API_PATH.ANSWER.GET_ANSWER_BY_QUESTION_ID(questionId),
        });
    },

    /* Tạo answer */
    createAnswer(params: CreateAnswerRequest) {
        return BaseService.post<ResponseSuccess<AnswerResponse>>({
            url: API_PATH.ANSWER.CREATE_ANSWER,
            payload: params,
        });
    },

    /* Cập nhật answer */
    updateAnswer(params: UpdateAnswerRequest) {
        return BaseService.put<ResponseSuccess<AnswerResponse>>({
            url: API_PATH.ANSWER.UPDATE_ANSWER,
            payload: params,
        });
    },

    /* Xoá answer */
    deleteAnswer(id: string) {
        return BaseService.remove<ResponseSuccess<void>>({
            url: API_PATH.ANSWER.DELETE_ANSWER(id),
        });
    },
};