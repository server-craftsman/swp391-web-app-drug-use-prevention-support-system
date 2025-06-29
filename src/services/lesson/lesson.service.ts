import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  LessonRequest,
  CreateLessonRequest,
  DeleteLessonRequest,
  UpdateLessonRequest,
  GetLessonBySessionIdRequest,
} from "../../types/lesson/Lesson.req.type";
import type { Lesson } from "../../types/lesson/Lesson.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const LessonService = {
  getAllLessons(params: LessonRequest) {
    return BaseService.get<ResponseSuccess<Lesson[]>>({
      url: API_PATH.LESSON.GET_ALL_LESSONS,
      payload: params,
    });
  },
  createLesson(params: CreateLessonRequest) {
    return BaseService.post<ResponseSuccess<Lesson>>({
      url: API_PATH.LESSON.CREATE_LESSON,
      payload: params,
    });
  },
  deleteLesson(params: DeleteLessonRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.LESSON.DELETE_LESSON(params.id),
      payload: params,
    });
  },
  updateLesson(params: UpdateLessonRequest) {
    return BaseService.put<ResponseSuccess<Lesson>>({
      url: API_PATH.LESSON.UPDATE_LESSON(params.id),
      payload: params,
    });
  },
  getLessonBySessionId(params: GetLessonBySessionIdRequest) {
    return BaseService.get<ResponseSuccess<Lesson[]>>({
      url: API_PATH.LESSON.GET_LESSON_BY_SESSION_ID(params.SessionId),
      payload: params,
    });
  },
};
