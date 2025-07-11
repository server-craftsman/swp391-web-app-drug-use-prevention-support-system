import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  ProgramRequest,
  CreateProgramRequest,
} from "../../types/program/Program.req.type";
import type { PaginatedProgramResponse } from "../../types/program/Program.res.type";
import type { Program, ProgramEnrollment } from "../../types/program/Program.type";
import { API_PATH } from "../../consts/api.path.const";

export const ProgramService = {
  getAllPrograms(params: ProgramRequest) {
    return BaseService.get<PaginatedProgramResponse>({
      url: API_PATH.PROGRAM.GET_ALL_PROGRAMS,
      payload: params,
    });
  },
  createProgram(params: CreateProgramRequest) {
    return BaseService.post<ResponseSuccess<Program>>({
      url: API_PATH.PROGRAM.CREATE_PROGRAM,
      payload: params,
    });
  },
  updateProgram(id: string, params: CreateProgramRequest) {
    const payload = {
      ...params,
      id: id,
    };
    return BaseService.put<ResponseSuccess<Program>>({
      url: API_PATH.PROGRAM.UPDATE_PROGRAM(id),
      payload: payload,
    });
  },
  deleteProgram(id: string) {
    return BaseService.remove<ResponseSuccess<Program>>({
      url: API_PATH.PROGRAM.DELETE_PROGRAM(id),
    });
  },
  getProgramById(id: string) {
    return BaseService.get<Program>({
      url: API_PATH.PROGRAM.GET_PROGRAM_BY_ID(id),
    });
  },
  enrollProgram(programId: string) {
    return BaseService.post<ResponseSuccess<any>>({
      url: API_PATH.PROGRAM.ENROLL_PROGRAM,
      payload: { programId },
    });
  },
  programEnrollments() {
    return BaseService.get<ResponseSuccess<ProgramEnrollment[]>>({
      url: API_PATH.PROGRAM.PROGRAM_ENROLLMENTS,
    });
  },
};
