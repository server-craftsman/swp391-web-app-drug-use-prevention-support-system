import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type {
  CourseRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  DeleteCourseRequest,
  CourseDetailRequest,
} from "../../types/course/Course.req.type";
import type {
  Course,
  CourseDetailResponse,
} from "../../types/course/Course.res.type";

export const CourseService = {
  getAllCourses(params: CourseRequest) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_ALL_COURSES,
      payload: params,
    });
  },
  createCourse(params: CreateCourseRequest) {
    return BaseService.post<ResponseSuccess<Course>>({
      url: API_PATH.COURSE.CREATE_COURSE,
      payload: params,
    });
  },
  updateCourse(params: UpdateCourseRequest) {
    return BaseService.put<ResponseSuccess<Course>>({
      url: API_PATH.COURSE.UPDATE_COURSE(params.id),
      payload: params,
    });
  },
  deleteCourse(params: DeleteCourseRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.COURSE.DELETE_COURSE(params.id),
      payload: params,
    });
  },
  getCourseById(param: CourseDetailRequest) {
    return BaseService.get<ResponseSuccess<CourseDetailResponse>>({
      url: API_PATH.COURSE.GET_COURSE_BY_ID(param.id),
      payload: param,
    });
  },
  getMyCourses(userId: string) {
    return BaseService.get<ResponseSuccess<Course[]>>({
      url: API_PATH.COURSE.GET_MY_COURSES,
      payload: { userId },
    });
  },
};
