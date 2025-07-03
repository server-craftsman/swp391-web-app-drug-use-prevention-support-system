import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  SessionRequest,
  CreateSessionRequest,
  DeleteSessionRequest,
  UpdateSessionRequest,
  GetSessionByCourseIdRequest,
  GetSessionByIdRequest,
} from "../../types/session/Session.req.type";
import type { Session } from "../../types/session/Session.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const SessionService = {
  getAllSessions(params: SessionRequest) {
    return BaseService.get<ResponseSuccess<Session[]>>({
      url: API_PATH.SESSION.GET_ALL_SESSIONS,
      payload: params,
    });
  },
  createSession(params: CreateSessionRequest) {
    return BaseService.post<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.CREATE_SESSION,
      payload: params,
    });
  },
  deleteSession(params: DeleteSessionRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.SESSION.DELETE_SESSION(params.id),
      payload: params,
    });
  },
  updateSession(params: UpdateSessionRequest) {
    return BaseService.put<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.UPDATE_SESSION(params.id),
      payload: params,
    });
  },
  getSessionByCourseId(params: GetSessionByCourseIdRequest) {
    return BaseService.get<ResponseSuccess<Session[]>>({
      url: API_PATH.SESSION.GET_SESSION_BY_COURSE_ID(params.CourseId),
      payload: params,
    });
  },
  getSessionById(params: GetSessionByIdRequest) {
    return BaseService.get<ResponseSuccess<Session>>({
      url: API_PATH.SESSION.GET_SESSION_BY_ID(params.id),
      payload: params,
    });
  },
};
