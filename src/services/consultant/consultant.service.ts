import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type { Consultant } from "../../types/consultant/consultant.res.type";
import { API_PATH } from "../../consts/api.path.const";
import type {
  ConsultantRequest,
  CreateConsultantRequest,
  UpdateConsultantRequest,
  DeleteConsultantRequest,
  ConsultantDetailRequest,
} from "../../types/consultant/consultant.req.type";

export const ConsultantService = {
  getAllConsultants(params: ConsultantRequest) {
    return BaseService.get<ResponseSuccess<Consultant[]>>({
      url: API_PATH.CONSULTANT.GET_ALL_CONSULTANTS,
      payload: params,
    });
  },

  createConsultant(params: CreateConsultantRequest) {
    return BaseService.post<ResponseSuccess<Consultant>>({
      url: API_PATH.CONSULTANT.CREATE_CONSULTANT,
      payload: params,
    });
  },

  updateConsultant(params: UpdateConsultantRequest) {
    return BaseService.put<ResponseSuccess<Consultant>>({
      url: API_PATH.CONSULTANT.UPDATE_CONSULTANT(params.id),
      payload: params,
    });
  },

  deleteConsultant(params: DeleteConsultantRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.CONSULTANT.DELETE_CONSULTANT(params.id),
      payload: params,
    });
  },

  getConsultantById(param: ConsultantDetailRequest) {
    return BaseService.get<ResponseSuccess<Consultant>>({
      url: API_PATH.CONSULTANT.GET_CONSULTANT_BY_ID(param.id),
      payload: param,
    });
  },
};
