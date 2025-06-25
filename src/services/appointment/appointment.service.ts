import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type { AppointmentRequest } from "../../types/appointment/Appointment.req.type";
import type { Appointment } from "../../types/appointment/Appointment.res.type";

export const AppointmentService = {
  createAppointment(params: AppointmentRequest) {
    return BaseService.post<ResponseSuccess<Appointment>>({
      url: API_PATH.APPOINTMENT.CREATE_APPOINTMENT,
      payload: params,
    });
  },
};
