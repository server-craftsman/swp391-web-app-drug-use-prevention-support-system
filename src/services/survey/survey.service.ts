import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
    CreateSurveyRequest,
    SearchSurveyRequest,
    UpdateSurveyRequest,
    SubmitSurveyRequest,
} from "../../types/survey/Survey.req.type";
import type { SurveyResponse, SurveySubmissionResponse } from "../../types/survey/Survey.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const SurveyService = {
    /* Lấy danh sách survey phân trang */
    getAllSurveys(params: SearchSurveyRequest) {
        const url = API_PATH.SURVEY.GET_ALL_SURVEYS;
        const payload = params;
        return BaseService.get<ResponseSuccess<SurveyResponse[]>>({
            url,
            payload,
        });
    },

    /* Tạo survey mới */
    createSurvey(params: CreateSurveyRequest) {
        return BaseService.post<ResponseSuccess<SurveyResponse>>({
            url: API_PATH.SURVEY.CREATE_SURVEY,
            payload: params,
        });
    },

    /* Cập nhật survey */
    updateSurvey(id: string, params: UpdateSurveyRequest) {
        return BaseService.put<ResponseSuccess<SurveyResponse>>({
            url: API_PATH.SURVEY.UPDATE_SURVEY(id),
            payload: params,
        });
    },

    /* Xoá survey */
    deleteSurvey(id: string) {
        return BaseService.remove<ResponseSuccess<void>>({
            url: API_PATH.SURVEY.DELETE_SURVEY(id),
        });
    },

    /* Lấy survey theo id */
    getSurveyById(id: string) {
        return BaseService.get<ResponseSuccess<SurveyResponse>>({
            url: API_PATH.SURVEY.UPDATE_SURVEY(id), // same path as update (GET)
        });
    },

    /* User submit survey câu trả lời */
    submitSurvey(params: SubmitSurveyRequest) {
        return BaseService.post<ResponseSuccess<SurveySubmissionResponse>>({
            url: API_PATH.SURVEY.SUBMIT_SURVEY,
            payload: params,
        });
    },
};





