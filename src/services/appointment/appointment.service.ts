import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type { Appointment } from "../../types/appointment/Appointment.res.type";
import type {
  CreateAppointmentRequest,
  SearchAppointmentRequest,
  ChangeStatusRequest,
  AssignConsultantRequest,
} from "../../types/appointment/Appointment.req.type";

export const AppointmentService = {
  /* Create / book a new appointment */
  createAppointment(params: CreateAppointmentRequest) {
    return BaseService.post<ResponseSuccess<Appointment>>({
      url: API_PATH.APPOINTMENT.CREATE_APPOINTMENT,
      payload: params,
    });
  },

  /* Search appointments with given filters (now via query parameters in the URL) */
  searchAppointments(params: Partial<SearchAppointmentRequest>) {
    const url = API_PATH.APPOINTMENT.SEARCH_APPOINTMENT;

    // Strip out any undefined / null / empty-string values so they’re not added to the query string
    const cleanedParams = Object.fromEntries(
      Object.entries(params ?? {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    return BaseService.get<ResponseSuccess<Appointment[]>>({
      url,
      payload: cleanedParams,
    });
  },

  /* Change status of an appointment (e.g., confirm, complete, …) */
  changeStatus(params: ChangeStatusRequest) {
    const url = API_PATH.APPOINTMENT.CHANGE_STATUS(
      params.appointmentId,
      params.newStatus
    );
    return BaseService.put<ResponseSuccess<Appointment>>({
      url,
      payload: params,
    });
  },

  /* Assign a consultant to an appointment */
  assignConsultant(params: AssignConsultantRequest) {
    return BaseService.post<ResponseSuccess<Appointment>>({
      url: API_PATH.APPOINTMENT.ASSIGN_CONSULTANT,
      payload: params,
    });
  },

  /* Cancel an appointment by its ID */
  cancelAppointment(appointmentId: string) {
    return BaseService.put<ResponseSuccess<void>>({
      url: API_PATH.APPOINTMENT.CANCEL_APPOINTMENT(appointmentId),
    });
  },
};
